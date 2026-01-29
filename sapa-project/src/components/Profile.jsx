import { useState, useEffect } from "react";
import { db } from "../data/firebase";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { MoveLeft,CircleCheckIcon } from "lucide-react";
import { formatDate } from "../utils/formatDate";

export default function Profile({
  party,
  // posts,
  profileTab,
  setProfileTab,
  navigateTo,
  openPost,
}) {
  const getPostsByPartyID = async (partyID) => {
    try {
        const postsQuery = query(
            collection(db, "posts"),
            where("partyID", "==", partyID),
            orderBy("date", "desc"),
            limit(50)
        );
        const querySnapshot = await getDocs(postsQuery);
        return querySnapshot.docs.map(doc => ({ 
            ...doc.data(), 
            id: doc.id 
        }));
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
  };

  const [posts, setPosts] = useState([]);
  useEffect(() => {
      const loadData = async () => {
        const data = await getPostsByPartyID(party.id);
          setPosts(data);
      };
      loadData();
  },[party.id]);

  return (
    <div className='animate-fade-up pb-28 min-h-screen relative max-w-xl mx-auto px-6 pt-8 space-y-4'>
      <button onClick={() => navigateTo("parties")} className="hover:cursor-pointer mb-6 flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-blue-900 transition-colors group">
        <MoveLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform " /> กลับ
      </button>
      
      <div className="relative bg-white rounded-[40px] p-6 md:p-8 border border-blue-50 shadow-2xl shadow-blue-900/5 mb-8 overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-24 opacity-10" style={{background : party.icon}}></div>
        <div className="relative z-10">
          <div className="w-28 h-28 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-2xl mb-6 transform -rotate-3 overflow-hidden" style={{ color: party.icon, border: '8px solid '}}>
              <div className="w-full h-full flex items-center justify-center text-white font-black text-4xl " style={{background: party.icon}}>
                  {party.img ? <img src={party.img} alt="Party Logo" className="w-full h-full object-cover"/> : party.shortName[0]}
              </div>
          </div>
          <h2 className="text-2xl font-black mt-4">{party.name}</h2>
          <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[11px] font-black uppercase tracking-[3px] inline-block mb-6">{party.shortName}</span>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">{party.bio}</p>
        </div>
      </div>
      
          
      <div className="flex justify-between items-center mb-6 px-2">
        {["policies", "members", "posts"].map((t) => (
          <button
            key={t}
            onClick={() => setProfileTab(t)}
            className={profileTab === t ? "font-black" : "tab-btn pb-2 text-xs font-black uppercase tracking-widest hover:cursor-pointer"} 
          >
            {t === 'policies' ? 'นโยบาย' : t === 'members' ? 'สมาชิกพรรค' : 'โพสต์'}
          </button>
        ))}
      </div>
      <div>
        {profileTab === "policies" &&
        <div className="space-y-4 animate-fade-up">
          {party.policies.map((p, i) => (
              <div key={i} className=" p-5 bg-white rounded-3xl border border-blue-50 shadow-sm">
                <div>
                  <CircleCheckIcon className="w-5 h-5"/>
                </div>
                <h4 className="font-extrabold text-blue-950 mb-1">{p.title}</h4>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{p.desc}</p>
              </div>
          ))}
        </div>
        }

        {profileTab === "members" &&
          <div className="grid grid-cols-2 gap-4">
            {party.members.map((m, i) => (
              <div key={i} className="animate-fade-up p-4 rounded">
                <div className="bg-white p-5 rounded-3xl border border-blue-50 text-center">
                      <div className="w-40 h-30 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 font-bold mb-3 border border-slate-100">
                          {m.img}
                      </div>
                      <h6 className="font-extrabold text-blue-950 text-sm mb-0.5">{m.name}</h6>
                      <p className="text-blue-600 text-[10px] font-black uppercase tracking-wider">{m.role}</p>
                  </div>
              </div>
            ))}
          </div>
        }

        {profileTab === "posts" &&
          <div className="space-y-4 animate-fade-up">
            {posts.filter((p) => p.partyID === party.id).map((p) => (
                <div
                  key={p.partyID}
                  className="mt-4 p-5 bg-white rounded-3xl border border-blue-50 shadow-2xs"
                >
                  <div>
                      <p className="text-xs text-slate-400">
                          {formatDate(p.date?.toDate ? p.date.toDate() : p.date)}
                      </p>
                      <h4 className="font-bold text-gray-600 leading-relaxed mb-3">
                        {p.content}
                      </h4>
                      <p className="text-blue-600 text-xs cursor-pointer underline" onClick={() => openPost(p.id)}>เพิ่มเติม</p>
                  </div>
                </div>
              ))}
          </div>
        }
      </div>
    </div>
  );
}
