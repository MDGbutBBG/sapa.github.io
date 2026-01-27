import { FaFacebook,FaInstagram } from "react-icons/fa";
import { Mail } from "lucide-react";

export default function Footer() {
    return (
        <>  
            <footer className="bg-white-800 border-t border-blue-100 text-white py-12 px-6 flex flex-col items-center">
                <h2 className="text-m font-semibold text-blue-950 mb-2">
                    คณะกรรมการสภานักเรียนโรงเรียนนารีรัตน์จังหวัดเเพร่
                </h2>
                <h4 className="text-s text-slate-400"> ติดต่อเรา </h4>
                <div className="flex flex-row gap-6 mt-4 mb-4">
                        <FaFacebook onClick={() => window.open("https://www.facebook.com/profile.php?id=100090712844000", "_blank")} className="w-10 h-10 text-blue-500 cursor-pointer hover:text-blue-300 transition" />
                        <FaInstagram onClick={() => window.open("https://www.instagram.com/studentcouncil_nr?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", "_blank")} className="w-10 h-10 text-blue-500 cursor-pointer hover:text-blue-300 transition" />
                </div>
                <hr className="w-100 h-0.5 text-slate-400 mb-6"/>
                <p className="text-[10px] font-light text-slate-400 tracking-widest uppercase">
                    © 2024 คณะกรรมการสภานักเรียนโรงเรียนนารีรัตน์จังหวัดเเพร่. All rights reserved.
                </p>
            </footer>
        </>
    )
}