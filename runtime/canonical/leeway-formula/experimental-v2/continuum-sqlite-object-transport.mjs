/*
LEEWAY HEADER — DO NOT REMOVE
REGION: LEEWAY.FORMULA.CONTINUUM.SQLITE
TAG: LEEWAY.COMPRESSED_OBJECT_SQLITE.CANDIDATE_V1
WHAT: Isolated additive SQLite transport for versioned exact objects.
WHY: Never reinterpret or overwrite Continuum legacy raw content parts.
WHO: LeeWay Industries. WHERE: Formula candidate; NOT canonical Continuum deployment.
WHEN: 2026-10-25. HOW: transaction + scoped identity + independent readback.
AUTHORITY: LAB_ONLY. LICENSE: Existing LeeWay Formula repository terms.
*/
import {DatabaseSync} from 'node:sqlite';
const DDL=`CREATE TABLE IF NOT EXISTS leeway_compressed_objects(
 identity TEXT PRIMARY KEY,owner_scope TEXT NOT NULL,manifest_json TEXT NOT NULL
) STRICT;
CREATE TABLE IF NOT EXISTS leeway_compressed_parts(
 identity TEXT NOT NULL REFERENCES leeway_compressed_objects(identity),
 part_index INTEGER NOT NULL, payload BLOB NOT NULL,
 PRIMARY KEY(identity,part_index)
) STRICT;`;
const fail=c=>{throw Error(c)};
export function createIsolatedSqliteObjectStore({databasePath}={}){
 if(typeof databasePath!=='string'||!databasePath)fail('LEEWAY_SQLITE_EXPLICIT_PATH_REQUIRED');
 const db=new DatabaseSync(databasePath,{enableForeignKeyConstraints:true});
 db.exec('PRAGMA foreign_keys=ON;'); db.exec(DDL);
 const store={
  async putIfAbsent({identity,ownerScope,object}){
   if(identity!==JSON.stringify([ownerScope,object?.manifest?.originalSha256]))fail('LEEWAY_SQLITE_IDENTITY_INVALID');
   db.exec('BEGIN IMMEDIATE');
   try{
    const existing=db.prepare('SELECT manifest_json,owner_scope FROM leeway_compressed_objects WHERE identity=?').get(identity);
    const manifest=JSON.stringify(object.manifest);
    if(existing){
     if(existing.owner_scope!==ownerScope||existing.manifest_json!==manifest)fail('LEEWAY_SQLITE_IDEMPOTENCY_CONFLICT');
    }else{
     db.prepare('INSERT INTO leeway_compressed_objects VALUES(?,?,?)').run(identity,ownerScope,manifest);
     const insert=db.prepare('INSERT INTO leeway_compressed_parts VALUES(?,?,?)');
     for(let i=0;i<object.parts.length;i++)insert.run(identity,i,Buffer.from(object.parts[i]));
    }
    db.exec('COMMIT');return {committed:true,deduplicated:Boolean(existing)};
   }catch(e){if(db.isTransaction)db.exec('ROLLBACK');throw e}
  },
  async get({identity,ownerScope}){
   const row=db.prepare('SELECT manifest_json FROM leeway_compressed_objects WHERE identity=? AND owner_scope=?').get(identity,ownerScope);
   if(!row)return null;
   const manifest=JSON.parse(row.manifest_json),parts=[];
   for(const item of db.prepare('SELECT part_index,payload FROM leeway_compressed_parts WHERE identity=? ORDER BY part_index').iterate(identity)){
    if(item.part_index!==parts.length)fail('LEEWAY_SQLITE_PART_ORDER_INVALID');
    parts.push(new Uint8Array(item.payload));
   }
   if(parts.length!==manifest.partCount)fail('LEEWAY_SQLITE_PART_COUNT_INVALID');
   return {manifest,parts};
  },
  close(){db.close()}
 };
 return store;
}
