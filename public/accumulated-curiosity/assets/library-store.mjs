import {validateMetadata} from './library-model.mjs';
export function createLibraryStore(client) {
  async function all(table,userId,page) {
    const rows=[];
    for(let offset=0;;offset+=500) {
      let query=client.from(table).select('*').eq('user_id',userId);
      if(page) query=query.eq('page_path',page);
      query=table==='ac_data_points'?query.order('created_at',{ascending:false}).order('id'):query.order('chapter_slug');
      const {data,error}=await query.range(offset,offset+499);
      if(error) throw error; rows.push(...data); if(data.length<500) return rows;
    }
  }
  return {
    loadPoints:(userId,page)=>all('ac_data_points',userId,page),
    loadProgress:userId=>all('ac_reading_progress',userId),
    async savePoint(userId,point) {
      const metadata=validateMetadata(point);
      let query;
      if(point.id) query=client.from('ac_data_points').update(metadata).eq('user_id',userId).eq('id',point.id);
      else {
        const {page_path,page_title,section_id,section_title,quote,start_offset,end_offset,prefix,suffix}=point;
        query=client.from('ac_data_points').insert({user_id:userId,page_path,page_title,section_id,section_title,quote,start_offset,end_offset,prefix,suffix,...metadata});
      }
      const {data,error}=await query.select().single(); if(error) throw error;return data;
    },
    async removePoint(userId,id) {
      const {data,error}=await client.from('ac_data_points').delete().eq('user_id',userId).eq('id',id).select('id').single();
      if(error) throw error;return data;
    },
    async saveProgress(chapter,position,section,completed=false) {
      const {data,error}=await client.rpc('ac_save_progress',{p_chapter:chapter,p_position:position,p_section:section,p_completed:completed});
      if(error) throw error;return data;
    }
  };
}
