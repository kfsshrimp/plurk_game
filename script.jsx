//(()=>{
  var Ex = {
    id:"React",
    cfg:{
        db_url:"https://speakgame-c3706-default-rtdb.firebaseio.com/",
        db_time:firebase.database.ServerValue.TIMESTAMP,
        storage:"local",
        system_set:{
            debug:false,
            def_number:5, //越大 def效益越低
            user_lvup_number:1.5, //越大expmax越小,
            dead_countdown:0.1,//越大 倒數時間越久
            skill_exp:10000,//越大 得到的技能經驗越少
            agi_pass:10,//越大 迴避成功需求差距值越多
            bonus_use_ary:[
              "karma",
              "friends_count",
              "fans_count",
              "plurks_count",
              "response_count",
              "profile_views"
            ]
        },
        default_skill:[
            {
              lv:1,
              name:"卡瑪之力",
              memo:"全狀態依卡瑪比率上升",
              status:{
                hp:["karma",1,0.1],
                atk:["karma",1,0.1],
                def:["karma",1,0.1],
                agi:["karma",1,0.1]
              },
              exp:0,
              count:5
            },
            {
              lv:1,
              name:"好友之力",
              memo:"生命依好友數比率上升",
              status:{
                hp:["friends_count",0.5,0.1],
              },
              exp:0,
              count:1
            },
            {
              lv:1,
              name:"粉絲之力",
              memo:"防禦依粉絲數比率上升",
              status:{
                def:["fans_count",0.5,0.1],
              },
              exp:0,
              count:1
            },
            {
              lv:1,
              name:"廢噗王",
              memo:"攻擊依發噗數比率上升",
              status:{
                atk:["plurks_count",0.01,0.01],
              },
              exp:0,
              count:1
            },
            {
              lv:1,
              name:"回噗機器人",
              memo:"速度依回噗數比率上升",
              status:{
                agi:["response_count",0.1,0.1],
              },
              exp:0,
              count:1
            },
            {
              lv:1,
              name:"連擊",
              memo:"機率發動連擊",
              status:{
                atk:["karma",0.1,0.1]
              },
              effect:[
                {
                  type:"attack_combo",
                  count:[1,0.05],
                  pass:[30,0.1]
                }
              ],
              exp:0,
              count:1
            },
            {
              lv:1,
              name:"挑釁",
              memo:"機率吸引攻擊",
              status:{
                def:["karma",0.1,0.1]
              },
              effect:[
                {
                  type:"guard",
                  pass:[30,0.1]
                }
              ],
              exp:0,
              count:1
            }
        ],
        user_info:{
          full_name:"姓名",
          nick_name:"帳號",
          karma:"卡馬",
          friends_count:"好友數",
          fans_count:"粉絲數",
          plurks_count:"發噗數",
          response_count:"回噗數",
          profile_views:"人氣指數",
          join_date:"註冊日期"
        },
        user_status:{
            lv:"等級",
            hp:"生命",
            atk:"攻擊",
            def:"防禦",
            agi:"速度",
            exp:"經驗",
            bonus:"點數",
            dead:"撤退"
        },
        monster:[
          {
              name:"肉骨獸",
              lv:1,
              hp:9999,
              atk:100,
              def:100,
              agi:100,
              count:90,
              skill:[
                {
                  lv:1,
                  name:"肉骨獸連擊",
                  memo:"機率發動連擊",
                  status:{
                    atk:["karma",0.1,0.1]
                  },
                  effect:[
                    {
                      type:"attack_combo",
                      count:[1,0.05],
                      pass:[30,0.1]
                    }
                  ]
                }
              ]
          },
          {
              name:"肉骨獸(紅)",
              lv:5,
              hp:9999 * 10,
              atk:200,
              def:100,
              agi:500,
              count:5,
              skill:[
                {
                  lv:1,
                  name:"肉骨獸連擊",
                  memo:"機率發動連擊",
                  status:{
                    atk:["karma",0.1,0.1]
                  },
                  effect:[
                    {
                      type:"attack_combo",
                      count:[1,0.05],
                      pass:[30,0.1]
                    }
                  ]
                }
              ]
          },
          {
              name:"肉骨獸(經驗)",
              lv:5,
              hp:9999 * 100,
              atk:50,
              def:-9999,
              agi:0,
              count:1,
              skill:[
                {
                  lv:1,
                  name:"肉骨獸連擊",
                  memo:"機率發動連擊",
                  status:{
                    atk:["karma",0.1,0.1]
                  },
                  effect:[
                    {
                      type:"attack_combo",
                      count:[1,0.05],
                      pass:[30,0.1]
                    }
                  ]
                }
              ]
        }


        ]
    },
    flag:{
        db_time:null,
        url:{
            get:(row)=>{
                return new URL(location.href).searchParams.get(row);
            }
        }
        
    },
    func:{
        StorageUpd:()=>{

            if(Ex.flag.local===undefined || Ex.flag.session===undefined)
            {
                Ex.flag.local = JSON.parse(localStorage[Ex.id]||`{}`);
                Ex.flag.session = JSON.parse(sessionStorage[Ex.id]||`{}`);

                Ex.flag.storage = Ex.flag[Ex.cfg.storage];
            }
            else
            {
                Ex.flag[Ex.cfg.storage] = Ex.flag.storage;

                localStorage[Ex.id] = JSON.stringify(Ex.flag.local);
                sessionStorage[Ex.id] = JSON.stringify(Ex.flag.session);
            }
        },
        ClickEvent:(e)=>{

            if(Ex.func[e.target.dataset.event]!==undefined)
            {
                Ex.func[e.target.dataset.event](e);
            }
        },
        DBTime:(func)=>{

            Ex.DB.ref("DBTIME").set(Ex.cfg.db_time).then(()=>{

                Ex.DB.ref("DBTIME").once("value",r=>{

                    Ex.flag.db_time = r.val();

                    Ex.flag.day = Ex.func.IOSDate(new Date(Ex.flag.db_time)).split(" ")[0];


                    if( typeof(func)==="function" ) func();
                });

            });

        },
        GetParentElement:(target,selector)=>{


            if(target.parentElement.querySelector(selector)===null)
            {
                return Ex.func.GetParentElement(target.parentElement,selector);
            }
            else
            {
                return target;
            }
        },
        Close:(e)=>{
            
            document.querySelectorAll(e.target.dataset.selector).forEach(o=>{
                o.remove();
            });

        },
        PopDiv:(html,e)=>{

            var div = document.createElement("div");
            div.className = "pop";
            
            if(e!==undefined)
            {
                div.style.left = e.x + window.scrollX + 'px';
                div.style.top = e.y + window.scrollY +  'px';
            }

            div.innerHTML = html;


            document.body.prepend(div);


            return div;
        },
        IOSDate:(IOSDate,opt = {})=>{

            if(IOSDate===undefined) return opt.msg||``;

            opt.Y = (opt.Y!==undefined)?opt.Y:true;
            opt.M = (opt.M!==undefined)?opt.M:true;
            opt.D = (opt.D!==undefined)?opt.D:true;
            opt.h = (opt.h!==undefined)?opt.h:true;
            opt.m = (opt.m!==undefined)?opt.m:true;
            opt.s = (opt.s!==undefined)?opt.s:true;
               

            var str = ``;

            str += (opt.Y)?new Date(IOSDate).getFullYear()+'-':'';
            str += (opt.M)?(new Date(IOSDate).getMonth()+1).toString().padStart(2,'0')+'-':'';
            str += (opt.D)?(new Date(IOSDate).getDate()).toString().padStart(2,'0')+' ':'';

            str += (opt.h)?new Date(IOSDate).getHours().toString().padStart(2,'0')+':':'';
            str += (opt.m)?new Date(IOSDate).getMinutes().toString().padStart(2,'0')+':':'';
            str += (opt.s)?new Date(IOSDate).getSeconds().toString().padStart(2,'0'):'';

            return str;
        },
        FriendsList:(i)=>{


          document.querySelector("#SearchFriendsLine").style.background = `linear-gradient(to right, #0d0 ${(i+1)/Ex.PlurkApi.friends.length*100}% , #fff 0%)`;


          if(Ex.PlurkApi.friends[i]!==undefined)
          {
              var api = Ex.PlurkApi;

              

              api.act = "Profile/getPublicProfile";
              api.arg.nick_name = Ex.PlurkApi.friends[i].nick_name;
              api.arg.include_plurks = "false";
              api.mode = "CORS";
              api.func = (detail)=>{

                  Ex.PlurkApi.friends[i].Detail = JSON.parse(detail.response||`{}`);


                  if(Ex.PlurkApi.friends[i+1]!==undefined)
                  {
                    setTimeout(()=>{
                      Ex.func.FriendsList(i+1); 
                    },0);
                      
                  }
                  else
                  {
                    document.querySelector(".pop").remove();
                    Ex.flag.GetFriendsDetail = false;
                  }
              }

              api.Send();
          }
          else
          {
            document.querySelector(".pop").remove();
            Ex.flag.GetFriendsDetail = false;
          }

        },
        SearchMonster:()=>{

            console.log('SearchMonster')

            var monster_ary = [];

            Ex.cfg.monster.forEach((v,k)=>{

                v.id = k;

                for(var i=0;i<v.count;i++) {
                  monster_ary.push(
                    JSON.parse(JSON.stringify(v))
                  );
                }

            });



            Ex.flag.storage.monster = monster_ary.sort(()=>Math.random()-Math.random())[0];

            Ex.func.StorageUpd();

            Ex.flag.Main.setState({MenuContent:<Ex.temp.Battle />})

        },
        UserControl:(e)=>{


          var mode = e.target.dataset.mode;

          var user_id = e.target.dataset.user_id;

          var user = Ex.flag.storage.team.filter(v=>v.id===parseInt(user_id))[0].Detail.user_info;


          switch(mode){

            case "lv":
              var exp = Ex.func.UserStatus(user,"exp");
    
    
              user._exp-=exp;
              user.bonus+=1;
              user.lv+=1;
    
            break;

            case "bonus":
              if(user.bonus>0){
                user[e.target.dataset.user_status]+=1;
                user.bonus-=1;

              }

            break;



          }

          Ex.func.StorageUpd();
    
          Ex.flag.Main.setState({MenuContent:<Ex.temp.Team />});

          


        },
        SkillControl:(e)=>{


          Ex.flag.Skilltemp = Ex.flag.Skilltemp||{};

          Ex.flag.Skilltemp.skill = Ex.flag.Skilltemp.skill||{};
          Ex.flag.Skilltemp.user = Ex.flag.Skilltemp.user||{};

          

          Ex.flag.Skilltemp.user = (e.target.dataset.user_id!==undefined)?Object.values(Ex.flag.storage.team).filter(user=>user.id===parseInt(e.target.dataset.user_id))[0].Detail.user_info:Ex.flag.Skilltemp.user;

          Ex.flag.Skilltemp.skill = (e.target.dataset.skill_id!==undefined)?Object.values(Ex.flag.storage.skill).filter(v=>parseInt(e.target.dataset.skill_id)===v.id)[0]:Ex.flag.Skilltemp.skill;




          if(Ex.flag.Skilltemp.user.dead===1)
          {
            /*
              Ex.func.PopDiv(`
              撤退中不可編輯
              <hr>
              <button data-event="Close" data-selector=".pop">關閉</button>
              `,e);

              return;
              */
          }


          var mode = e.target.dataset.mode;

          switch(e.type)
          {
              case "click":

                if(mode==="lvup")
                {
                    var skill = Ex.flag.Skilltemp.skill;


                    if(skill.exp<skill.lv) return;

                    Object.values(Ex.flag.storage.skill).forEach(v => {
                        v.exp-=skill.lv;
                    });

                    skill.lv+=1;

                }
                else if(mode==="del")
                {
                    var skill = Ex.flag.Skilltemp.skill;
                    skill.count+=1;

                    var user = Ex.flag.Skilltemp.user;

                    user.skill.splice(
                      user.skill.findIndex(v=>v===parseInt(skill.id))
                      ,1);


                    Ex.flag.Skilltemp.user._hp = (Ex.flag.Skilltemp.user._hp>Ex.func.UserStatus(Ex.flag.Skilltemp.user,"hp"))?Ex.func.UserStatus(Ex.flag.Skilltemp.user,"hp"):Ex.flag.Skilltemp.user._hp;
                }


              break;

              case "dragstart":

              break;

              case "dragend":

                if(Ex.flag.Skilltemp.user.id===undefined) return;

                if(Ex.flag.Skilltemp.skill.count<=0)
                {
                    Ex.func.PopDiv(`
                    技能數量不足
                    <hr>
                    <button data-event="Close" data-selector=".pop">關閉</button>
                    `,e);
                    delete Ex.flag.Skilltemp;
                    return;
                }

                
                if( Math.pow(2,Ex.flag.Skilltemp.user.skill.length) > Ex.flag.Skilltemp.user.lv){

                    Ex.func.PopDiv(`
                    隊員等級未達技能數量上限，所需等級：${Math.pow(2,Ex.flag.Skilltemp.user.skill.length)}
                    <hr>
                    <button data-event="Close" data-selector=".pop">關閉</button>
                    `,e);
                    delete Ex.flag.Skilltemp;
                    return;
                }

                /*
                if(Ex.flag.Skilltemp.user.skill.filter(v=>v.id===Ex.flag.Skilltemp.skill.id)[0]!==undefined)
                {
                    Ex.func.PopDiv(`
                    不可重覆安裝技能
                    <hr>
                    <button data-event="Close" data-selector=".pop">關閉</button>
                    `,e);
                    delete Ex.flag.Skilltemp;
                    return;
                }
                */

                Ex.flag.Skilltemp.skill.count-=1;

                Ex.flag.Skilltemp.user.skill.push(Ex.flag.Skilltemp.skill.id);

                
                delete Ex.flag.Skilltemp;

              break;

              case "dragover":

                var user_id = Ex.func.GetParentElement(e.target,"[id]").id;


                Ex.flag.Skilltemp.user = Object.values(Ex.flag.storage.team).filter(user=>user.id===parseInt(user_id))[0].Detail.user_info;


              break;
          }


          
          


          Ex.func.StorageUpd();
          Ex.flag.Main.setState({MenuContent:<Ex.temp.Team />})

        },
        UserStatus:(user_info,key)=>{

          var status = user_info[key]||0;

          
          if(key.indexOf("_")===0 && 
          user_info[key.split("_")[1]]!==undefined)
          {
              switch (key.split("_")[1])
              {
                case "exp":
                  status = user_info[key]||0;
                break;

                case "hp":
                  status = user_info[key]||Ex.func.UserStatus(user_info,"hp");
                break;

              }
          }

          
          
          user_info.skill.forEach(v => {

            var skill = Ex.flag.storage.skill.filter(s=>s.id===v)[0];
            
            
            var row = Object.keys(skill.status).filter(row=>row===key)[0];
            var skill_effect = skill.status[row];

            if(skill_effect===undefined) return;

            status += parseFloat( user_info[ skill_effect[0] ] * (skill_effect[1] + (skill_effect[2]||0) * skill.lv) );

            
          });

          status = parseFloat(status.toFixed(1));
          if(key==="hp") status = parseFloat(status.toFixed(0));


          return status;
        },
        ExpMax:(user_info)=>{

            return Math.floor( Math.max(
              user_info.karma,
              user_info.friends_count,
              user_info.fans_count,
              user_info.plurks_count,
              user_info.response_count,
              user_info.profile_views
            ) * user_info.lv/Ex.cfg.system_set.user_lvup_number );
        },
        DamageCalc:(atker,defer)=>{

          
          var atk = (atker.atk===undefined)?Ex.func.UserStatus(atker,"atk"):atker.atk;

          var def = (defer.def===undefined)?Ex.func.UserStatus(defer,"def"):defer.def;

          

          var damage = parseFloat((atk - (def/Ex.cfg.system_set.def_number) + Math.random()*(def/Ex.cfg.system_set.def_number) - (def/Ex.cfg.system_set.def_number)).toFixed(0));
          
          
          return (damage<=0)?1:damage;

        },
        AgiCalc:(atker,defer)=>{


          var atk = (atker.agi===undefined)?Ex.func.UserStatus(atker,"agi"):atker.agi;

          var def = (defer.agi===undefined)?Ex.func.UserStatus(defer,"agi"):defer.agi;

          var agi = (def-atk>0)?(def-atk):0;

          agi = Math.floor(agi/Ex.cfg.system_set.agi_pass);

          agi = (agi>50)?50:agi;


          var rand = [];
          for(var r=1;r<=100;r++){
        
              rand.push( 
                  (r<=agi)?true:false 
                );
          }

          return rand.sort(()=>Math.random()-Math.random())[0];

        },
        MonsterSkill:(monster,user_info)=>{

            var return_damage_ary = [];
            var rand = [];
            var damage,type;

            monster.skill.forEach(skill=>{

              if(skill.effect!==undefined){

                  skill.effect.forEach(effect=>{

                    switch (effect.type)
                    {
                        case "attack_combo":

                            rand = [];

                            for(var r=1;r<=100;r++){
      
                                rand.push( 
                                    (r<=(effect.pass[0])+Math.floor(effect.pass[1]*skill.lv))?true:false 
                                  );
                            }
      
                            if( rand.sort(()=>Math.random()-Math.random())[0] ){

                                for(var i=0;i<(effect.count[0])+Math.floor(effect.count[1]*skill.lv);i++)
                                {

                                    type = "monster";
                                    damage = Ex.func.DamageCalc(monster,user_info);
                                    if(Ex.func.AgiCalc(monster,user_info))
                                    {
                                        type = "miss";
                                        damage = 0;
                                    }

                                    return_damage_ary.push({
                                      user:monster,
                                      type:type,
                                      memo:skill.name,
                                      damage:damage
                                    });
                                }
                            }

                        break;

                        default:

                        break;
                    }

                  });

              }

            })

            return return_damage_ary;
        },
        AttackSkill:(user_info,monster)=>{

            var return_damage_ary = [];
            var rand = [];
            var damage,type;


            user_info.skill.forEach(skill=>{

              skill = Ex.flag.storage.skill.filter(s=>s.id===skill)[0];

              if(skill.effect!==undefined){

                  skill.effect.forEach(effect=>{

                    switch (effect.type)
                    {
                        case "attack_combo":

                            rand = [];

                            for(var r=1;r<=100;r++){
      
                                rand.push( 
                                    (r<=(effect.pass[0])+Math.floor(effect.pass[1]*skill.lv))?true:false 
                                  );
                            }
      
                            if( rand.sort(()=>Math.random()-Math.random())[0]){

                                for(var i=0;i<(effect.count[0])+Math.floor(effect.count[1]*skill.lv);i++)
                                {

                                    type = "user";
                                    damage = Ex.func.DamageCalc(user_info,monster);
                                    if(Ex.func.AgiCalc(user_info,monster))
                                    {
                                        type = "miss";
                                        damage = 0;
                                    }

                                    return_damage_ary.push({
                                      user:user_info,
                                      type:type,
                                      memo:skill.name,
                                      damage:damage
                                    });
                                }
                            }

                        break;

                        case "guard":

                            rand = [];

                            for(var r=1;r<=100;r++){
      
                                rand.push( 
                                    (r<=(effect.pass[0])+Math.floor(effect.pass[1]*skill.lv))?true:false 
                                  );
                            }

                            if( rand.sort(()=>Math.random()-Math.random())[0] && user_info.dead!==1){

                                return_damage_ary.push({
                                  user:user_info,
                                  type:"user_guard",
                                  memo:skill.name,
                                  damage:0
                                });
                                
                            }


                        break;





                        default:

                        break;
                    }

                  });

              }
          });



          return return_damage_ary;

        },
        Attack:()=>{

          var battle_info = [];
          var msg;
          var agi_ary = [ Ex.flag.storage.monster ];
          var damage;
          var damage_total = 0;
          var damage_ary = [];
          var damage_skill_ary = [];
          var team = Ex.flag.storage.team;

          var type,memo;

          var monster = Ex.flag.storage.monster;
          var monster_target = team.filter(v=>v.Detail.user_info.dead!==1).sort(()=>Math.random()-Math.random())
          
          monster_target = (monster_target.length>0)?monster_target[0].Detail.user_info:null;


          if(monster===undefined){

              Ex.func.PopDiv(`請先尋找怪物<hr>
              <button data-event="Close" data-selector=".pop">關閉</button>`);
              return;
          }

          if(monster._hp<=0){

            Ex.func.PopDiv(`請先尋找怪物<hr>
            <button data-event="Close" data-selector=".pop">關閉</button>`);
            return;
          }
          

          if(monster_target===null){
            
            Ex.func.PopDiv(`無隊員可戰鬥<hr>
            <button data-event="Close" data-selector=".pop">關閉</button>`);
            return;
          }

          

          
          team.forEach((v)=>{

              if(v.dead===1) return;

              var user_info = v.Detail.user_info;

              agi_ary.push(user_info);

              damage = Ex.func.DamageCalc(user_info,monster);


              type = "user";
              memo = "攻擊";
              if(Ex.func.AgiCalc(user_info,monster))
              {
                  type = "miss";
                  damage = 0;
              }

              damage_ary.push({
                user:user_info,
                type:type,
                memo:memo,
                damage:damage
              });

              damage_skill_ary = damage_skill_ary.concat(Ex.func.AttackSkill(user_info,monster));


          })
          damage_ary = damage_ary.concat( damage_skill_ary );
          

          var user_guard = damage_ary.filter(v=>v.type==="user_guard")[0];

          if(user_guard!==undefined){
            monster_target = user_guard.user;
          }
          


          damage = Ex.func.DamageCalc(monster,monster_target);

          


          type = "monster";
          memo = "攻擊";
          if(Ex.func.AgiCalc(monster,monster_target))
          {
              type = "miss";
              damage = 0;
          }

          damage_ary.push({
            user:monster,
            type:type,
            memo:memo,
            damage:damage
          });


          damage_ary = damage_ary.concat(Ex.func.MonsterSkill(monster,monster_target));



          console.log(damage_ary);




          agi_ary.sort((a,b)=>{
            var a_agi = (a.agi===undefined)?Ex.func.UserStatus(a,"agi"):a.agi;
            var b_agi = (b.agi===undefined)?Ex.func.UserStatus(b,"agi"):b.agi;

            return b_agi - a_agi;
          }).forEach(a=>{


              damage_ary.forEach(v=>{
                
                if(v.user.id!==a.id) return;

                switch (v.type){

                    case "monster":

                        if(monster._hp>0){

                            msg = `【${monster.name}】${v.memo}【${monster_target.full_name}】造成${v.damage}傷害`;

                            monster_target._hp = Ex.func.UserStatus(monster_target,"_hp");
        
                            monster_target._hp-=v.damage;
        
                            if(monster_target._hp<=0)
                            {
                                msg += `，傷害過大，【${monster_target.full_name}】撤退`;
                                monster_target.dead = 1;
                                monster_target.dead_time = new Date().getTime() + Ex.func.ExpMax(monster_target)*Ex.cfg.system_set.dead_countdown;
                            }
        
                            battle_info.push(msg);

                        }


                    break;


                    case "user":

                        if(v.user.dead!==1 && Ex.func.UserStatus(v.user,"_hp")>0)
                        {

                            msg = `【${v.user.full_name}】${v.memo}【${monster.name}】造成${v.damage}傷害`;

                            battle_info.push(msg);
        
                            damage_total+=v.damage;
                        }
                        
                    break;

                    case "miss":

                      if(v.user.full_name!==undefined)
                      {
                        if(v.user.dead!==1 && Ex.func.UserStatus(v.user,"_hp")>0)
                        {
                            msg = `【${v.user.full_name}】${v.memo}【${monster.name}】沒有擊中`;
                            battle_info.push(msg);
                        }
                      }
                      else
                      {
                          msg = `【${monster.name}】${v.memo}【${monster_target.full_name}】沒有擊中`;
                          battle_info.push(msg);
                      }

                      

                    break;

                    case "user_guard":

                        if(v.user.dead!==1 && Ex.func.UserStatus(v.user,"_hp")>0)
                        {

                            msg = `【${v.user.full_name}】${v.memo}`;

                            battle_info.push(msg);
                        }
                        
                    break;


                }
              
              })

          })


          monster._hp-=damage_total;
          

          if(monster._hp<=0){

              team.forEach(user=>{

                  user.Detail.user_info._exp = Ex.func.UserStatus(user.Detail.user_info,"_exp") + monster.hp;


              });


              Ex.flag.storage.skill.forEach(skill=>{

                  skill.exp+=Math.ceil(monster.hp/Ex.cfg.system_set.skill_exp);

              });
          }

          Ex.flag.Main.setState({battle_info:
              battle_info.map((v,key)=>
                <span key={key}>{v}</span>
              )
          });

          Ex.func.StorageUpd();

          Ex.flag.Main.setState({MenuContent:<Ex.temp.Battle />});



        }
    },
    ReactClass:{
        List:class extends React.Component{
          constructor(props) {
              super(props);
          }


          SelectFriend(e){


            var tr = e.target.parentElement.parentElement;

            Ex.flag.storage.team = Ex.flag.storage.team||[];

            
            
            if( Ex.flag.storage.team.filter(v=>v.id===parseInt(tr.id))[0]===undefined )
            {
              if(Ex.flag.storage.team.length>=5)
              {
                  Ex.func.PopDiv(`
                  最大只可選擇5名好友
                  <hr>
                  <button data-event="Close" data-selector=".pop">關閉</button>
                  `);
                  
                  return;
              }

                tr.className = "select";
              
                Ex.flag.storage.team.push( 
                  Ex.PlurkApi.friends.filter(v=>v.id===parseInt(tr.id))[0]
                );
            }
            else
            {
              tr.className = "";
              
              Ex.flag.storage.team.splice(
                Ex.flag.storage.team.findIndex(v=>v.id===parseInt(tr.id))
                ,1)

            }
            


          }
          

          render() {
            var list = Ex.PlurkApi.friends.sort(()=>Math.random()-Math.random());

            while(list.length>10){list.pop()}


                        
            list = list.map((user)=>
            
              <Ex.temp.SelectFriend key={user.id} user={user} click={this.SelectFriend.bind(this)} />
              
            );
          
            return (<table><tbody>
                            
              <tr>
                <td>姓名</td>
                <td>帳號</td>
                <td>卡馬</td>
                <td>好友數</td>
                <td>粉絲數</td>
                <td>發噗數</td>
                <td>回噗數</td>
                <td>人氣指數</td>
                <td>註冊日期</td>
                <td></td>
              </tr>
              {list}
              <tr>
                  <td colSpan={10}><button onClick={Ex.flag.Main.TeamCreate.bind(Ex.flag.Main)}>送出</button></td>
                </tr>
              </tbody>
            </table>
              
              )
           
          }
        }
    },
    temp:{
        Body:()=>{

            return `<div id="Main"></div>`;
        },
        DeadCountDown:class extends React.Component{

          constructor(props){
            super(props);

            var dead_time = props.user_info.dead_time||new Date().getTime();
            this.state = {
              countdown:dead_time - new Date().getTime()
            }

          }

          componentDidMount() {

                this.timerID = setInterval(
                    () => this.countdown(),
                    1000
                );
          }
        
          componentWillUnmount() {
            clearInterval(this.timerID);
          }

          countdown(){

            var countdown = this.state.countdown;
            countdown-=1000;

            if(countdown<=0)
            {
                this.props.user_info.dead = 0;
                this.props.user_info._hp = Ex.func.UserStatus(this.props.user_info,"hp");
                Ex.func.StorageUpd();
                

                (Ex.flag.Main.state.MenuContent.type.name==="Battle")?Ex.flag.Main.setState({MenuContent:<Ex.temp.Battle />}):Ex.flag.Main.setState({MenuContent:<Ex.temp.Team />})
                
            }

            this.setState({countdown:countdown})

          }

          render(){

              var sec = (Math.floor(this.state.countdown/1000));
              if(sec<60) sec = <span>{sec}秒</span>
              if(sec>=60 && sec<3600) sec = <span>{Math.floor(sec/60)}分</span>
              if(sec>=3600) sec = <span>{Math.floor(sec/3600)}時</span>

              return sec;
          }

        },
        BonusUseButton:(props)=>{


          return <button data-mode={"bonus"} onClick={Ex.func.UserControl} data-user_id={props.user_id} data-user_status={props.user_status}>UP</button>


        },
        UserInfo:(props)=>{

          var user_info = props.user_info;

          user_info.skill = user_info.skill||[];
          user_info.lv = user_info.lv||1;
          user_info.hp = user_info.hp||10;
          user_info.bonus = user_info.bonus||0;
          user_info.exp = Ex.func.ExpMax(user_info);

          
          

          var info = Object.keys(Ex.cfg.user_info).map(key=>{
            
            if(props.mode==="battle" && key!=="full_name") return;

            var value = user_info[key];
            var bonus_use = null;
            
            if(key==="join_date")
            {
              value = Ex.func.IOSDate(user_info[key],{h:false,m:false,s:false})
            }

            if(user_info.bonus>0 && Ex.cfg.system_set.bonus_use_ary.indexOf(key)!==-1) bonus_use = <Ex.temp.BonusUseButton user_id={user_info.id} user_status={key} />

            return <span key={key}>{Ex.cfg.user_info[key]}：{value} {bonus_use}</span>

          });



          var status = Object.keys(Ex.cfg.user_status).map(key=>{
            
              if(key==="dead") return;

              switch (key){
                case "exp":
                case "hp":

                  
                  return <span key={key}>{Ex.cfg.user_status[key]}：{Ex.func.UserStatus(user_info,`_${key}`)} / {Ex.func.UserStatus(user_info,key)}</span>

                default:
                  return <span key={key}>{Ex.cfg.user_status[key]}：{Ex.func.UserStatus(user_info,key)}</span>

              }

          });

          
          
          var skill = user_info.skill.map((v,k)=>{

              var v = Ex.flag.storage.skill.filter(s=>s.id===v)[0];

              return <span key={k}>{v.name} {(props.mode==="team")?<button data-mode="del" data-skill_id={v.id} data-user_id={user_info.id} onClick={Ex.func.SkillControl}>移除</button>:''}
              </span>

          });

          

          return (

            <div className={(user_info.dead===1)?"dead":""} 
            onDragOver={Ex.func.SkillControl} id={user_info.id}>

              {(user_info.dead===1)?<span style={{color:"#fff"}}>【撤退中】歸隊還需<Ex.temp.DeadCountDown user_info={user_info} /></span>:null} 

              {info}


              <div className="status">
              素質<br />
              {status}
              {(Ex.func.UserStatus(user_info,"exp")<=user_info._exp && props.mode!=="battle")?<button data-mode={"lv"} data-user_id={user_info.id} onClick={Ex.func.UserControl}>升級</button>:null}
              </div>

              <div className="skill">
              技能<br />
              {skill}
              </div>

            </div>

          );
        },
        Skill:(props)=>{

          var skill = props.skill;

          return (

            <div onDragStart={Ex.func.SkillControl} onDragEnd={Ex.func.SkillControl} draggable="true" data-skill_id={skill.id}>
              技能：{skill.name}<br />
              等級：{skill.lv}<br />
              說明：{skill.memo}<br />
              數量：{skill.count}<br />
              經驗：{skill.exp} / {skill.lv}<br />
              {(skill.exp>=skill.lv)?<button data-mode="lvup" data-skill_id={skill.id} onClick={Ex.func.SkillControl}>升級</button>:null}
              
            </div>

          );

        },
        SearchFriend:()=>{

          var Main = Ex.flag.Main;

          Ex.flag.storage.team = Ex.flag.storage.team||[];

          if(Ex.flag.storage.team.length===5){

            return <div>
              <button onClick={Main.Reset.bind(Main)}>初始化(清除所有記錄)</button>

              {(Ex.cfg.system_set.debug)?<button onClick={Main.click2.bind(Main)}>Ex.PlurkApi.friends</button>:null}
              
            </div>
            
          }
          

          return <div>
            <input value={Main.state.account} onChange={Main.change.bind(Main)} placeholder="噗浪帳號"></input>

            <button onClick={Main.SearchFriend.bind(Main)}>搜尋噗浪好友</button>


            {(Ex.cfg.system_set.debug)?<button onClick={Main.click2.bind(Main)}>Ex.PlurkApi.friends</button>:null}


            
          </div>
        


        },
        SelectFriend:(props)=>{

          var user = props.user;
          var click = props.click;

          var info = Object.keys(Ex.cfg.user_info).map(key=>{

            if(key==="join_date")
              return <td key={key}>{Ex.func.IOSDate(user.Detail.user_info[key],{h:false,m:false,s:false})}</td>
            else
              return <td key={key}>{user.Detail.user_info[key]}</td>

          });


          return (<tr id={user.id} key={user.id}>
            {info}
            <td><button onClick={click}>選擇</button></td>
          </tr>);

        },
        Menu:()=>{

          var Main = Ex.flag.Main;

          Ex.flag.storage.team = Ex.flag.storage.team||[];


          if(Ex.flag.storage.team.length===5){

            return <table>
                <tbody>
                  <tr>
                    <td>
                      <button id="team" onClick={Main.MenuClick.bind(Main)}>
                      編輯隊伍
                      </button>
                    </td>
                    <td>
                      <button id="battle" onClick={Main.MenuClick.bind(Main)}>
                      開始戰鬥
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>;
          }



          return null;

        },
        Team:()=>{
          

          var team = Ex.flag.storage.team.map((v)=>

            <Ex.temp.UserInfo key={v.id} mode={'team'}  user_info={v.Detail.user_info} />
          )

          Ex.flag.storage.skill = Ex.flag.storage.skill||Ex.cfg.default_skill;

          


          Ex.flag.storage.skill.forEach((v,k)=>{

              if(v.id===undefined) v.id = k;

          });





          var skill = Ex.flag.storage.skill.map(v=>

            <Ex.temp.Skill key={v.id} skill={v} />

            );

            

          return (
            <div>
              <div id="Team">
                {team}
              </div>
              <div id="Skill">
                {skill}
              </div>
            </div>);
        },
        Monster:()=>{

            var monster = Ex.flag.storage.monster;

            if(monster===undefined){

              return (

              <div>
                <button onClick={Ex.func.SearchMonster}>尋找怪物</button>
              </div>

              );

            }

            monster._hp = (monster._hp===undefined)?monster.hp:monster._hp;


            var style = {
              background:`linear-gradient(to right, #0d0 ${monster._hp/monster.hp*100}% , #fff 0%)`
            }

            

            return (
              <div>
                <span>
                  【{monster.name}】等級：{monster.lv}
                  {(monster._hp<=0)?<span>【討伐成功】</span>:null}
                </span>
                <div id="HpLine" style={style}></div>
                {(monster._hp<=0)?<button onClick={Ex.func.SearchMonster}>尋找怪物</button>:null}
              </div>
            );

        },
        Battle:()=>{

          //Ex.flag.storage.monster = Ex.flag.storage.monster||Ex.cfg.monster[0];


          var team = Ex.flag.storage.team.map((v)=>

            <Ex.temp.UserInfo key={v.id} mode={'battle'} user_info={v.Detail.user_info} />
          )



          return (
          <div id="Battle">
            <div id="Monster">
              <Ex.temp.Monster />
            </div>

            <div id="Team">
              {team}
            </div>

            <button onClick={Ex.func.Attack}>攻擊</button>
           
            <div id="BattleInfo">
            {Ex.flag.Main.state.battle_info}
            </div>
          </div>
          );

        },
        Main:class extends React.Component{

          constructor(props){
            super(props);
            this.state = {
              account:'',
              Menu:<Ex.temp.Menu />
            };

            
          }

          change(e){
            this.setState({account:e.target.value});
          }



          click2(e){

            console.log(Ex)
          }

          SearchFriend(){

              Ex.flag.storage = {};
              

              Ex.func.StorageUpd();

              var account = this.state.account;

              var api = Ex.PlurkApi;

              api.act = "Profile/getPublicProfile";

              api.arg.nick_name = account;
              api.mode = "CORS";
              api.func = (user)=>{

                  try{

                    user = JSON.parse(user.response);

                  }catch(e){

                    Ex.func.PopDiv(`帳號錯誤無法搜尋到好友
                    <hr>
                    <button data-event="Close" data-selector=".pop">關閉</button>`);

                    return;
                      
                  }

                  


                  var rand_offset = Math.floor(Math.random()*user.friends_count)+1;

                  rand_offset = (rand_offset>=user.friends_count-10)?user.friends_count-10:rand_offset;

                  
                  
                  api.act = "FriendsFans/getFriendsByOffset";

                  api.arg.user_id = user.user_info.id;
                  api.arg.offset = rand_offset;
                  api.arg.limit = "100";
                  api.func = (friends)=>{

                      Ex.func.PopDiv(`好友搜尋中
                      <div id="SearchFriendsLine" style="background:linear-gradient(to right, #0d0 0% , #fff 0%)"></div>`);


                      Ex.PlurkApi.friends = JSON.parse(friends.response||`{}`);

                      if(Object.keys(Ex.PlurkApi.friends).length===0){

                        document.querySelector(".pop").remove();
                        
                        Ex.func.PopDiv(`帳號錯誤無法搜尋到好友
                        <hr>
                        <button data-event="Close" data-selector=".pop">關閉</button>`);

                        return;
                      }


                      Ex.flag.GetFriendsDetail = true;
                      Ex.func.FriendsList(0);



                      var _t = setInterval(()=>{

                        if(!Ex.flag.GetFriendsDetail)
                        {
                            clearInterval(_t);
                            console.log(`Ex.flag.GetFriendsDetail=false`);


                            this.setState({Menu:<Ex.ReactClass.List />})
                            
                        }

                      },0);
                  }

                  api.Send();


              }
              api.Send();
          }


          MenuClick(e){

            var mode = e.target.id;
            var table = null;
            switch (mode)
            {
                case "team":
                  table = <Ex.temp.Team />
                break;

                case "battle":

                  table = <Ex.temp.Battle />

                break;

            }

            this.setState({MenuContent:table})

          }



          TeamCreate(){

            if(Ex.flag.storage.team.length!==5)
            {
                Ex.func.PopDiv(`
                隊伍人數需為5名
                <hr>
                <button data-event="Close" data-selector=".pop">關閉</button>
                `);
                return;
            }

            Ex.func.StorageUpd();


            this.setState({Menu:<Ex.temp.Menu />});
           
          }

          Reset(){

            Ex.flag.storage = {};
            Ex.func.StorageUpd();

            setTimeout(()=>{location.reload();},0); 

          }

          


          render(){

              Ex.flag.Main = this;


              return (<div>
                <Ex.temp.SearchFriend />

                {this.state.Menu}

                {this.state.MenuContent}
                

              </div>);
          }
            


        }
       
       

    },
    PlurkApi:new PlurkApi(),
    init:()=>{
        


        Ex.func.StorageUpd();

        Ex.DB = firebase;
        Ex.DB.initializeApp({databaseURL:Ex.cfg.db_url});
        Ex.DB = Ex.DB.database();

        document.addEventListener("click",Ex.func.ClickEvent);
        document.body.innerHTML = Ex.temp.Body();




        Ex.Main = ReactDOM.createRoot(document.querySelector('#Main'));
        //Ex.Main.render(Ex.temp.Main());
        Ex.Main.render(<Ex.temp.Main />);


    }
}


Ex.init();











function User(opt){
    return <h1 id={opt.id} >{opt.name}<br />HP：{opt.hp}</h1>
}

function List(props){

   

    var html = props.user_list.map((v,key)=>

        //<h1 id={v.id} data-key={key}>{v.name}<br />HP：{v.hp}</h1>
        <User id={v.id} key={key} name={v.name} hp={v.hp} />

    );

  


    return <div>{html}</div>;



    return (<div>
        <User name="shrimp" hp="100" />
        <User name="gura" hp="200" />
    </div>);
}








class Text extends React.Component{


  constructor(props){
      super(props);
      this.state = {x:props.x,y:props.y}
  }

  Change(e){
      
      var x,y;
      if(e.target.id==="x")
      {
          x = e.target.value;
          y = x*2;
      }
      else
      {
          y = e.target.value;
          x = y/2;
      }


      this.setState(()=>{
          return {
              x:x,
              y:y
          }
      })
      
  }

  render() {

      return <div>
          <input id="x" type="text" value={this.state.x} onChange={this.Change.bind(this)} /><br />
          <input id="y" type="text" value={this.state.y}  onChange={this.Change.bind(this)}/>
          </div>
  }
}




class Time extends React.Component {
  constructor(props) {
      
    super(props);
    this.state = {date: new Date()};

    this.flag = {
          test:"iii"
    }
    
  }

  componentDidMount() {

      if(TimerOn)
      {
          this.timerID = setInterval(
              () => this.tick(),
              1000
          );
      }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {

      if(!TimerOn)
      {
          
          this.setState((state,props)=>({

              date:this.state2.test

          }));


          clearInterval(this.timerID);
          return;
      }

      this.setState({
          date: new Date()
      });
  }

  render() {

      if(this.state.date.toLocaleTimeString!==undefined)
      {
          return (
              this.state.date.toLocaleTimeString()
          );
      }else
      {
          return (
              this.state.date
          );
      }
  }
}


class Login extends React.Component{

  constructor(props) {
      super(props);
      this.state = {login:false};

  
      // 為了讓 `this` 能在 callback 中被使用，這裡的綁定是必要的：
      //this.Click = this.Click.bind(this);
    }
  Click() {
    this.setState( function(state,props){
      return{
          login:!state.login
      }
    })


  };
  render() {
    return (
      <button onClick={this.Click.bind(this)}>
        {this.state.login?"登出":"登入"}
      </button>
    );
  }
}



var TimerOn = true;


class Btn extends React.Component {

  constructor(props) {
      super(props);
      this.state = {};

  
      // 為了讓 `this` 能在 callback 中被使用，這裡的綁定是必要的：
      //this.Click = this.Click.bind(this);
    }
  Click() {
    console.log('this is:', this);
   
    this.setState( function(state,props){
      return{
          count:(state.count||0)+ parseInt(props.x)
      }
    })


  };
  render() {
    return (
      <button onClick={this.Click.bind(this)}>
        Click me {this.state.count||0}
      </button>
    );
  }
}



//<List user_list={user_list} />

const x=10;

const name = 'Josh Perez';
const user_list = [{id:11,name:"shrimp",hp:"100"},{id:12,name:"gura",hp:"200"}];

//const Time = (props)=>{return props.date.toLocaleTimeString();}

var element = <h1>
        Hello, <List user_list={user_list}/>, now time is <Time input="tesssssst" /><br /><Btn x="1"/><br /><Login />
        <br />
        <Text x={x} y={x*2} id="x"/>
    </h1>;

//const root = ReactDOM.createRoot(document.querySelector('#React'))
//root.render(element);



/*
setTimeout(()=>{
    //const time_root = ReactDOM.createRoot(document.querySelector('#time'));

    
    setInterval(()=>{
        element = <h1>Hello, {List()} , now time is <span id="time"><Time date={new Date()}></Time></span></h1>;
        root.render(element);
    },1);

},0);
*/












//})();