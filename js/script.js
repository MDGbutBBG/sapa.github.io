// --- Enhanced Data (Draft Mode) ---

function formatDate(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() + 543;
    return `${day}/${month}/${year}`;
}

const PARTIES = [
    { 
        id: 'p1', 
        name: 'test_party_name_1', 
        shortName: 'PARTY 1', 
        icon: '#1e3a8a',
        color: '#1e3a8a',
        bio: 'test_bio_text_description_for_party_1', 
        members: [
            { name: 'test_member_1', role: 'Position A', img: 'M1' },
            { name: 'test_member_2', role: 'Position B', img: 'M2' },
            { name: 'test_member_3', role: 'Position C', img: 'M3' }
        ],
        policies: [
            { title: 'test_policy_title_1', desc: 'test_policy_description_text_1' },
            { title: 'test_policy_title_2', desc: 'test_policy_description_text_2' }
        ]
    },
    { 
        id: 'p2', 
        name: 'test_party_name_2', 
        shortName: 'PARTY 2', 
        icon: '#0284c7',
        color: '#0284c7',
        bio: 'test_bio_text_description_for_party_2', 
        members: [
            { name: 'test_member_4', role: 'Position A', img: 'M4' },
            { name: 'test_member_5', role: 'Position B', img: 'M5' }
        ],
        policies: [
            { title: 'test_policy_title_3', desc: 'test_policy_description_text_3' },
            { title: 'test_policy_title_4', desc: 'test_policy_description_text_4' }
        ]
    }
];


let POSTS = []; 

const url = "https://script.google.com/macros/s/AKfycbzogYPbBbKDyQ0EZhFSoJwFDLY2HnOZIZ3qvXGqNfqviqmP3AkATcL5yDd8Z1vDiaTZ/exec";


function fetchPosts() {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log("Data received:", data);
        const validData = data.filter(item => item && item.id);
        POSTS = validData;
        renderApp();
    })
    .catch(error => console.error("Error loading posts:", error));
}

fetchPosts();

// const POSTS = [
//     { id: 1, tag: 'p1', content: 'test_post_content_1', Date: 30, hasImage: false },
//     { id: 2, tag: 'p2', content: 'test_post_content_2', Date: 40, hasImage: false },
//     { id: 3, tag: 'p1', content: 'test_post_content_3', Date: 50, hasImage: false },
//     { id: 4, tag: 'p2', content: 'test_post_content_4', Date: 20, hasImage: false }
// ];

let state = {
    page: 'home',
    selectedParty: null,
    selectedPostId: null, 
    profileTab: 'policies', 
    sortBy: 'newest',
    electionDay: false
};

// --- Core Functions ---
function renderApp() {
    const root = document.getElementById('app-root');
    root.innerHTML = '';

    if (state.page === 'home') root.appendChild(renderHome());
    else if (state.page === 'parties') root.appendChild(renderParties());
    else if (state.page === 'profile') root.appendChild(renderProfile());
    else if (state.page === 'vote') root.appendChild(renderVote());
    else if (state.page === 'postDetail') root.appendChild(renderPostDetail());

    updateNav();
    lucide.createIcons();
}

function updateNav() {
    const nav = document.getElementById('main-nav');
    const homeBtn = document.getElementById('nav-home');
    const partiesBtn = document.getElementById('nav-parties');
    const voteBtn = document.getElementById('nav-vote');
    
    // Hide nav on postDetail page
    if (state.page === 'postDetail') {
        nav.style.display = 'none';
    } else {
        nav.style.display = 'flex';
    }

    // Reset
    [homeBtn, partiesBtn, voteBtn].forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('text-slate-300');
    });

    if (state.page === 'home') {
        homeBtn.classList.add('active');
        homeBtn.classList.remove('text-slate-300');
    } else if (state.page === 'parties' || state.page === 'profile') {
        partiesBtn.classList.add('active');
        partiesBtn.classList.remove('text-slate-300');
    } else if (state.page === 'vote') {
        voteBtn.classList.add('active');
        voteBtn.classList.remove('text-slate-300');
    }
}

function navigateTo(page, tag = null) {
    state.page = page;
    if (tag) state.selectedParty = PARTIES.find(p => p.id === tag);
    state.selectedPostId = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderApp();
}

function openPostDetail(postId) {
    state.selectedPostId = postId;
    state.page = 'postDetail';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderApp();
}

function setSortBy(value) {
    state.sortBy = value;
    renderApp();
}

// --- Templates ---
function renderHome() {
    const container = document.createElement('div');
    container.className = 'animate-fade-up';

    let displayPosts = [...POSTS];
    if (state.sortBy === 'newest') {
        displayPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (state.sortBy === 'oldest') {
        displayPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (state.sortBy === 'party') {
        displayPosts.sort((a, b) => a.tag.localeCompare(b.tag));
    }

    container.innerHTML = `
        <div class="flex items-center justify-between mb-8">
            <div>
                <h2 class="text-3xl font-[900] text-blue-950 tracking-tight">ประชาสัมพันธ์</h2>
                <p class="text-slate-400 font-medium">วันที่ ${formatDate(new Date())}</p>
            </div>
            
            <div class="relative">
                <select onchange="setSortBy(this.value)" class="appearance-none bg-white border border-blue-100 text-blue-900 py-2 pl-4 pr-10 rounded-xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
                    <option value="newest" ${state.sortBy === 'newest' ? 'selected' : ''}>ล่าสุด</option>
                    <option value="oldest" ${state.sortBy === 'oldest' ? 'selected' : ''}>เก่าสุด</option>
                    <option value="party" ${state.sortBy === 'party' ? 'selected' : ''}>พรรค</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-blue-400">
                    <i data-lucide="chevron-down" class="w-4 h-4"></i>
                </div>
            </div>
        </div>

        <div class="space-y-6">
            ${displayPosts.map(post => {
                const party = PARTIES.find(p => p.id === post.tag);
                return `
                    <div class="bg-white rounded-[32px] p-5 md:p-6 border border-blue-50 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-3 cursor-pointer" onclick="navigateTo('profile', '${party.id}')">
                                <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg" style="background: ${party.icon}">
                                    ${party.shortName[0]}
                                </div>
                                <div>
                                    <h4 class="font-extrabold text-blue-950 text-[15px]">${party.name}</h4>
                                    <div class="flex items-center gap-2 text-slate-400 text-[11px] font-bold">
                                        <span>${formatDate(post.date)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p class="text-slate-600 leading-relaxed font-medium mb-4">${post.content}</p>
                        
                        ${post.hasImage ? `
                        <div class="w-full h-full bg-sky-50 rounded-3xl border border-sky-100 flex items-center justify-center overflow-hidden mb-2">
                            <img src=${post.img} class="w-full h-full object-cover">
                        </div>
                        ` : ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;
    return container;
}

function renderParties() {
    const container = document.createElement('div');
    container.className = 'animate-fade-up';
    container.innerHTML = `
        <div class="mb-8">
            <h2 class="text-3xl font-[900] text-blue-950 tracking-tight">พรรค</h2>
            <p class="text-slate-400 font-medium">วันที่ ${formatDate(new Date())}</p>
        </div>
        <div class="grid gap-4 md:gap-5">
            ${PARTIES.map(p => `
                <div onclick="navigateTo('profile', '${p.id}')" class="group relative bg-white p-4 md:p-6 rounded-[32px] border border-blue-50 flex items-center gap-3 md:gap-5 cursor-pointer hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500">
                    <div class="w-16 h-16 md:w-20 md:h-20 rounded-[24px] flex items-center justify-center text-white font-black text-xl md:text-2xl shadow-xl transition-transform group-hover:scale-105 flex-shrink-0" style="background: ${p.icon}">
                        ${p.shortName[0]}
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="font-extrabold text-blue-950 text-base md:text-lg mb-0.5 md:mb-1 truncate">${p.name}</h3>
                        <p class="text-blue-600 text-[10px] md:text-[11px] font-black uppercase tracking-[2px] md:tracking-[3px] mb-1 md:mb-2 truncate">${p.shortName}</p>
                        <p class="text-slate-400 text-xs font-medium line-clamp-1 truncate">${p.bio}</p>
                    </div>
                    <div class="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-300 group-hover:bg-blue-600 group-hover:text-white transition-all flex-shrink-0">
                        <i data-lucide="arrow-right" class="w-4 h-4 md:w-5 md:h-5"></i>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    return container;
}

function renderProfile() {
    const p = state.selectedParty;
    const container = document.createElement('div');
    container.className = 'animate-fade-up';

    let tabContent = '';
    if (state.profileTab === 'policies') {
        tabContent = `<div class="space-y-4">
            ${p.policies.map(policy => `
                <div class="p-5 bg-white rounded-3xl border border-blue-50 shadow-sm">
                    <div class="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-600 mb-4">
                        <i data-lucide="check-circle" class="w-5 h-5"></i>
                    </div>
                    <h5 class="font-extrabold text-blue-950 mb-1">${policy.title}</h5>
                    <p class="text-slate-500 text-sm font-medium leading-relaxed">${policy.desc}</p>
                </div>
            `).join('')}
        </div>`;
    } else if (state.profileTab === 'members') {
        tabContent = `<div class="grid grid-cols-2 gap-4">
            ${p.members.map(m => `
                <div class="bg-white p-5 rounded-3xl border border-blue-50 text-center">
                    <div class="w-16 h-16 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 font-bold mb-3 border border-slate-100">
                        ${m.img}
                    </div>
                    <h6 class="font-extrabold text-blue-950 text-sm mb-0.5">${m.name}</h6>
                    <p class="text-blue-600 text-[10px] font-black uppercase tracking-wider">${m.role}</p>
                </div>
            `).join('')}
        </div>`;
    } else if (state.profileTab === 'posts') {
        const partyPosts = POSTS.filter(post => post.tag === p.id);
        tabContent = `<div class="space-y-4">
            ${partyPosts.map(post => `
                <div onclick="openPostDetail(${post.id})" class="p-4 bg-white rounded-2xl border border-blue-50 hover:border-blue-200 transition-all cursor-pointer group hover:shadow-lg hover:shadow-blue-900/5">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${formatDate(post.date)}</span>
                    </div>
                    <p class="text-slate-600 text-sm font-medium line-clamp-2 group-hover:text-blue-950 transition-colors">${post.content}</p>
                    <div class="mt-3 flex items-center gap-1 text-blue-400 text-[10px] font-bold uppercase tracking-wider group-hover:text-blue-600">
                        อ่านเพิ่มเติม <i data-lucide="arrow-right" class="w-3 h-3"></i>
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    container.innerHTML = `
        <button onclick="navigateTo('parties')" class="mb-6 flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-blue-900 transition-colors group">
            <i data-lucide="chevron-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i> กลับ
        </button>

        <div class="relative bg-white rounded-[40px] p-6 md:p-8 border border-blue-50 shadow-2xl shadow-blue-900/5 mb-8 overflow-hidden text-center">
            <div class="absolute top-0 left-0 w-full h-24 opacity-10" style="background: ${p.icon}"></div>
            <div class="relative z-10">
                <div class="w-28 h-28 mx-auto bg-white rounded-[32px] flex items-center justify-center shadow-2xl mb-6 transform -rotate-3" style="color: ${p.icon}; border: 8px solid white;">
                    <div class="w-full h-full rounded-[24px] flex items-center justify-center text-white font-black text-4xl" style="background: ${p.icon}">
                        ${p.shortName[0]}
                    </div>
                </div>
                <h2 class="text-2xl font-black text-blue-950 mb-2">${p.name}</h2>
                <span class="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-[11px] font-black uppercase tracking-[3px] inline-block mb-6">${p.shortName}</span>
                <p class="text-slate-500 text-sm font-medium leading-relaxed max-w-sm mx-auto">${p.bio}</p>
            </div>
        </div>

        <div class="flex justify-between items-center mb-6 px-2">
            <button onclick="switchTab('policies')" class="tab-btn pb-2 text-xs font-black uppercase tracking-widest ${state.profileTab === 'policies' ? 'active' : ''}">นโยบาย</button>
            <button onclick="switchTab('members')" class="tab-btn pb-2 text-xs font-black uppercase tracking-widest ${state.profileTab === 'members' ? 'active' : ''}">ทีมงาน</button>
            <button onclick="switchTab('posts')" class="tab-btn pb-2 text-xs font-black uppercase tracking-widest ${state.profileTab === 'posts' ? 'active' : ''}">โพสต์</button>
        </div>

        <div class="animate-fade-up">
            ${tabContent}
        </div>
        <div class="h-8"></div>
    `;
    return container;
}

// New View: Post Detail
function renderPostDetail() {
    const post = POSTS.find(p => p.id === state.selectedPostId);
    const party = PARTIES.find(p => p.id === post.tag);

    const container = document.createElement('div');
    container.className = 'animate-fade-up';
    container.innerHTML = `
        <button onclick="navigateTo('profile', '${party.id}')" class="mb-6 flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-blue-900 transition-colors group">
            <i data-lucide="chevron-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i> Back to Profile
        </button>

        <div class="bg-white rounded-[40px] border border-blue-50 shadow-2xl shadow-blue-900/5 p-8 overflow-hidden relative">
            <div class="absolute -top-20 -right-20 w-64 h-64 bg-sky-50 rounded-full blur-3xl opacity-50"></div>

            <div class="relative z-10">
                <div class="flex items-center gap-4 mb-8">
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg" style="background: ${party.icon}">
                        ${party.shortName[0]}
                    </div>
                    <div>
                        <h4 class="font-extrabold text-blue-950 text-lg">${party.name}</h4>
                        <div class="flex items-center gap-3 text-slate-400 text-xs font-bold mt-1">
                            <span>${formatDate(post.date)}</span>
                        </div>
                    </div>
                </div>

                <div class="prose prose-slate max-w-none">
                    <p class="text-xl text-blue-950 font-bold leading-relaxed mb-6">
                        ${post.content}
                    </p>
                    <p class="text-slate-500 leading-relaxed mb-6">
                        ${post.description}
                    </p>
                    
                    ${post.hasImage ? `
                    <div class="w-full h-full bg-sky-50 rounded-3xl border border-sky-100 flex items-center justify-center overflow-hidden mb-2">
                            <img src=${post.img} class="w-full h-full object-cover">
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    return container;
}

function renderVote() {

    const container = document.createElement('div');
    container.className = 'animate-fade-up h-[70vh] flex flex-col items-center justify-center text-center px-6';
    container.innerHTML = `
        ${!state.electionDay? `<div class="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-200 mb-8 animate-bounce">
            <i data-lucide="lock" class="w-10 h-10 text-blue-600"></i>
        </div>
        <h2 class="text-2xl font-[900] text-blue-950 mb-4">Election Day</h2>
        <div class="bg-white p-6 rounded-3xl border border-blue-50 shadow-lg max-w-xs mx-auto">
            <p class="text-slate-500 font-medium leading-relaxed">
                ท่านจะดูคะแนนได้แบบเรียลไทม์และย้อนหลังได้เมื่อถึงวันเลือกตั้ง
            </p>
        </div>` : ``}
    `;
    // container.innerHTML = ``
    return container;
}

window.switchTab = function(tab) {
    state.profileTab = tab;
    renderApp();
}

document.addEventListener('DOMContentLoaded', renderApp);
