import {readFileSync} from 'node:fs';import {join} from 'node:path';
export function readBlogMarkdown(slug:string){const file=join(process.cwd(),'content','blog',`${slug}.md`);const raw=readFileSync(file,'utf8');const body=raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/,'');return body.split(/\r?\n\s*\r?\n/).map(p=>p.trim()).filter(Boolean)}
