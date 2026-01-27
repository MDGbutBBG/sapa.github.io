import { useState,useEffect } from "react";
import { auth } from "../data/firebase.js"
import { GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import { IoLogIn,IoLogOut } from "react-icons/io5";
import { db } from "../data/firebase.js";
import { doc, setDoc } from "firebase/firestore";
import { useAuth} from "./Context.jsx";
import Vote from "./Vote.jsx";
import { VoteIcon } from "lucide-react";

const Logout = async (navigateTo) => {
    try {
        await auth.signOut();
        navigateTo('home');
        console.log("User signed out successfully");
    } catch (error) {
        console.error("Error during sign-out: ", error);
    }
};

export function Login({navigateTo, setForParty}) {
    const { user } = useAuth();
    const provider = new GoogleAuthProvider();
    const [clickAgain, setClickAgain] = useState(false);
    const cooldownTime = 5000;
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setClickAgain(false);
        }, cooldownTime);

        return () => clearTimeout(timer);
    }, [clickAgain]);

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const loginUser = result.user;

            const userRef = doc(db, "accounts",loginUser.uid);

            await setDoc(userRef, { 
                UID: loginUser.uid,
                name: loginUser.displayName,
                email: loginUser.email,
                displayImg: loginUser.photoURL,
                tag: 'user'
            },{ merge: true });

            const userLikesRef = doc(db, "accounts", loginUser.uid, "likePosts","init");
            await setDoc(userLikesRef, { initialized: true }, { merge: true });

            console.log("User Info: ", loginUser);
            navigateTo('home');
        } catch (error) {
            console.error("Error during sign-in: ", error);
        }
    };

    return (
        <div className="animate-fade-up h-[70vh] flex flex-col items-center justify-center text-center px-6">
            {user ? (
                <div className="flex flex-col items-center justify-center">
                    <h2 className="">คุณเข้าสู่ระบบในชื่อ {user.displayName} เเล้ว กรุณากลับไปหน้าหลัก</h2>
                    {clickAgain === false ? (<button onClick={() => setClickAgain(true)} className="mt-4 bg-red-950 text-white px-4 py-2 rounded-md flex items-center hover:cursor-pointer hover:bg-red-900 transition">
                        <IoLogOut className="mr-2"  />  ออกจากระบบ
                    </button>) : (<button onClick={() => Logout(navigateTo)} className="mt-4 bg-red-950 text-white px-4 py-2 rounded-md flex items-center hover:cursor-pointer hover:bg-red-900 transition">
                        <IoLogOut className="mr-2"  />  คลิกอีกครั้งเพื่อออกจากระบบ
                    </button>)}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <h2 className="">เข้าสู่ระบบด้วย Google หรือ เข้าสู่ระบบสำหรับพรรคการเลือกตั้ง</h2>
                    <div className="flex flex-row gap-10 items-center justify-center">
                        <button onClick={handleGoogleSignIn} className="mt-4 bg-indigo-950 text-white px-4 py-2 rounded-md flex items-center hover:cursor-pointer hover:bg-indigo-900 transition">
                            <FaGoogle className="mr-2" /> Login with Google
                        </button>
                        <button onClick={() => navigateTo('partyLogin')} className="mt-4 bg-sky-800 text-white px-4 py-2 rounded-md flex items-center hover:cursor-pointer hover:bg-sky-700 transition">
                            <VoteIcon className="mr-2" /> เข้าสู่ระบบสำหรับพรรค
                        </button>
                    </div>
                </div>
            )}
            <button onClick={() => navigateTo('home')} className="mt-4 bg-indigo-800 text-white px-4 py-2 rounded-md flex items-center hover:cursor-pointer hover:bg-indigo-700 transition">
                <IoLogIn className="mr-2" /> กลับไปหน้าหลัก
            </button>
        </div>
    )
}

export function PartyLogin() {
    return (
        <div className="animate-fade-up h-[70vh] flex flex-col items-center justify-center text-center px-6">
            <h2 className="">หน้าสำหรับพรรคการเลือกตั้งกำลังอยู่ในระหว่างการพัฒนา โปรดรอการอัปเดตในอนาคต</h2>
        </div>
    )
}