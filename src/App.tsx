/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Send, User, MessageSquare } from 'lucide-react';
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';

const IMAGES = Array.from({ length: 16 }, (_, i) => `images/image${i + 1}.JPG`);

// Paint stroke images provided by the user
const PAINT_STROKES = {
  white: "images/white.png",
  green: "images/green.png",
  orange: "images/orange.png",
  blue: "images/blue.png",
  brown: "images/brown.png",
  purple: "images/purple.png",
};

interface GuestbookEntry {
  id: string;
  name: string;
  content: string;
  createdAt: any;
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Guestbook state
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newEntries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GuestbookEntry[];
      setEntries(newEntries);
    }, (error) => {
      console.error("Guestbook fetch error:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleGuestbookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'guestbook'), {
        name: name.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(), // Using ISO string for simple rules validation
      });
      setName('');
      setContent('');
    } catch (error) {
      console.error("Error adding guestbook entry:", error);
      alert("방명록 작성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const changeImage = (dir: number) => {
    setCurrentIndex((prev) => {
      let next = prev + dir;
      if (next >= IMAGES.length) return 0;
      if (next < 0) return IMAGES.length - 1;
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7] overflow-x-hidden">
      {/* 1페이지: 메인 */}
      <section id="page1" className="w-full min-h-screen flex flex-col items-center justify-center p-5 text-center bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="text-[1.4rem] mb-10 text-[#8d7b68] font-bold leading-relaxed"
        >
          2026년 4월 17일<br />제희의 첫 번째 생일을<br />축하해주세요!
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="w-[85%] max-w-[300px] h-[400px] rounded-t-[150px] rounded-b-[20px] overflow-hidden shadow-2xl"
        >
          <img 
            src="images/image16.JPG" 
            alt="메인" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://picsum.photos/seed/jehee-main/600/800";
            }}
          />
        </motion.div>
      </section>

      {/* 2페이지: 인사말 */}
      <section id="page2" className="w-full min-h-screen flex flex-col items-center justify-center p-5 text-center bg-[#fdfaf7]">
        <div className="w-[300px] h-[40px] mb-[-12px] z-10">
          <svg viewBox="0 0 320 40" className="w-full h-full overflow-visible">
            <path id="curvePath" d="M 40,38 A 120,40 0 0,1 280,38" fill="transparent" />
            <text className="font-dancing text-[26px] fill-[#a6937c]">
              <textPath xlinkHref="#curvePath" startOffset="50%" textAnchor="middle">Happy 1st birthday</textPath>
            </text>
          </svg>
        </div>
        <h1 className="text-[2.8rem] tracking-[15px] mb-[25px] text-[#5d564e] pl-[15px] leading-none">제 희</h1>
        <div className="text-[0.95rem] text-[#555] leading-[2.2]">
          <p>2025년 4월 17일</p>
          <p>저희 곁에 찾아온 사랑스러운 제희가</p>
          <p>어느새 사계절을 지나<br />첫 번째 생일을 맞이했습니다.</p>
          <br />
          <p>가족분들의 따뜻한 사랑 덕분에<br />제희가 건강하게 자랄 수 있었습니다.</p>
          <br />
          <p>앞으로도 제희와 함께하는 매 순간이<br /> 빛나는 축복임을 잊지 않겠습니다.</p>
          <br />
          <p>감사드립니다.</p>
          <p className="mt-[30px] font-bold text-[#444]">아빠 오제형, 엄마 황희정 올림</p>
        </div>
      </section>

      {/* 3페이지: 성장 보고서 */}
      <section id="page3" className="w-full min-h-screen flex flex-col items-center justify-center p-[40px_15px] text-center bg-white">
        <div className="mb-5">
          <h2 className="font-dancing text-[4rem] text-black mb-[-10px]">Jehee</h2>
          <p className="text-[0.9rem] tracking-[5px] font-bold uppercase">12개월 성장 보고서</p>
        </div>

        <div className="flex w-full max-w-[360px] justify-between items-start mt-5">
          <div className="flex-1 flex flex-col gap-5 text-[0.85rem] text-left">
            <div>
              <h3 className="text-[0.9rem] mb-0.5 font-extrabold">키</h3>
              <p className="text-[0.8rem] text-[#555] mb-2.5">73 CM</p>
              <h3 className="text-[0.9rem] mb-0.5 font-extrabold">몸무게</h3>
              <p className="text-[0.8rem] text-[#555] mb-2.5">9.5 KG</p>
            </div>
            <div className="w-full h-[1px] bg-[#333] my-2.5"></div>
            <div>
              <h3 className="text-[0.9rem] mb-0.5 font-extrabold">할 수 있는 말</h3>
              <p className="text-[0.8rem] text-[#555] mb-2.5">아빠, 엄마, 물</p>
            </div>
          </div>

          <div className="flex-[1.5] pt-5">
            <img 
              src="images/image_report.png" 
              className="w-full h-auto rounded-full" 
              alt="중앙 사진" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://picsum.photos/seed/jehee-report/300/300";
              }}
            />
          </div>

          <div className="flex-1 flex flex-col gap-5 text-[0.85rem] text-right">
            <div>
              <h3 className="text-[0.9rem] mb-0.5 font-extrabold">생일</h3>
              <p className="text-[0.8rem] text-[#555] mb-2.5">2025.04.17</p>
              <h3 className="text-[0.9rem] mb-0.5 font-extrabold">치아 수</h3>
              <p className="text-[0.8rem] text-[#555] mb-2.5">8개</p>
            </div>
            <div className="w-full h-[1px] bg-[#333] my-2.5"></div>
            <div>
              <h3 className="text-[0.9rem] mb-0.5 font-extrabold">요즘 제희는</h3>
              <p className="text-[0.75rem] text-[#555] leading-relaxed">궁금한게 많아요<br />바쁘다바빠<br />밥이 맛있어요</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[360px] mt-[30px]">
          <div className="font-dancing text-[2rem] mb-[15px]">favourite things</div>
          <div className="grid grid-cols-[1fr_1px_1fr_1px_1fr] items-start">
            <div className="text-center">
              <h4 className="text-[0.85rem] mb-2.5 font-extrabold">노래</h4>
              <p className="text-[0.75rem] text-[#444] leading-relaxed">꼬마인디언<br />주먹 가위 보<br />나비야</p>
            </div>
            <div className="w-[1px] h-20 bg-[#333] self-center"></div>
            <div className="text-center">
              <h4 className="text-[0.85rem] mb-2.5 font-extrabold">음식</h4>
              <p className="text-[0.75rem] text-[#444] leading-relaxed">바나나<br />셈멜 빵<br />주먹밥</p>
            </div>
            <div className="w-[1px] h-20 bg-[#333] self-center"></div>
            <div className="text-center">
              <h4 className="text-[0.85rem] mb-2.5 font-extrabold">장난감</h4>
              <p className="text-[0.75rem] text-[#444] leading-relaxed">토니박스<br />나무 블럭</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4페이지: 사진첩 */}
      <section id="page4" className="w-full min-h-screen flex flex-col items-center justify-center p-5 text-center bg-[#fdfaf7]">
        <h2 className="text-[1.3rem] mb-[30px] text-[#8d7b68] font-bold">제희의 추억</h2>
        <div className="grid grid-cols-4 gap-2 w-full max-w-[360px]">
          {IMAGES.map((src, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full aspect-square bg-[#eee] overflow-hidden rounded-[4px] cursor-pointer"
              onClick={() => openModal(index)}
            >
              <img 
                src={src} 
                loading="lazy" 
                className="w-full h-full object-cover" 
                alt={`추억 ${index + 1}`}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/jehee-${index}/200/200`;
                }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5페이지: 영상 */}
      <section id="page5" className="w-full min-h-screen flex flex-col items-center justify-center p-5 text-center bg-white">
        <h2 className="text-[1.3rem] mb-[30px] text-[#8d7b68] font-bold">성장 기록 영상</h2>
        <div className="w-full max-w-[550px]">
          <div className="relative w-full pb-[56.25%] h-0 bg-black rounded-xl overflow-hidden">
            <iframe 
              src="https://www.youtube.com/embed/2Pjg7h13z2U?rel=0" 
              allowFullScreen 
              className="absolute top-0 left-0 w-full h-full border-0"
              title="성장 영상"
            ></iframe>
          </div>
        </div>
      </section>

      {/* 6페이지: 색깔 돌잡이 인트로 (NEW) */}
      <section id="page6" className="w-full min-h-screen flex flex-col items-center justify-center p-5 text-center bg-[#fdfaf7] relative overflow-hidden">
        {/* Decorative paint strokes */}
        <div className="absolute top-[-10px] left-[-10px] w-48 h-48 rotate-[-10deg]">
          <img src="images/cover_orange.png" className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
        </div>
        <div className="absolute bottom-[-10px] right-[-10px] w-48 h-48 rotate-[10deg]">
          <img src="images/cover_gray.png" className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
        </div>

        <motion.h2 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-[1.3rem] mb-[30px] text-[#8d7b68] font-bold"
        >
          제희's 초이스
        </motion.h2>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[3.5rem] font-black leading-tight mb-8 text-[#1a1a1a] tracking-tight"
        >
          색깔 돌잡이
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-[320px] text-left space-y-6"
        >
          <div className="space-y-1">
            <p className="text-[1.4rem] font-bold text-[#2d5a27]">제희가 앞으로</p>
            <p className="text-[1.4rem] font-bold text-[#1a1a1a]">색칠해갈 삶의 <span className="text-[#f27d26]">컬러</span></p>
          </div>
          
          <div className="text-[0.95rem] text-[#444] leading-relaxed space-y-4">
            <p>"오늘 저희 아이는 전통적인 물건 대신,<br />자신의 삶을 <span className="text-[#2d5a27] font-bold underline decoration-2 underline-offset-4">그려나갈 색깔</span>을 고릅니다."</p>
            <p>아이가 선택한 색상이 담고 있는<br />미래의 <span className="text-[#f27d26] font-bold">메시지</span>를 함께 확인해 주세요!</p>
          </div>
        </motion.div>
      </section>

      {/* 7페이지: 색깔별 의미 (NEW) */}
      <section id="page7" className="w-full min-h-screen flex flex-col items-center justify-center p-5 bg-white">
        <h2 className="text-[1.3rem] mb-[30px] text-[#8d7b68] font-bold text-center">준비된 색상</h2>
        
        <div className="w-full max-w-[400px] space-y-8">
          {[
            { 
              name: "뉴트럴 화이트", 
              keyword: "가능성 & 정직", 
              desc: "어떤 색으로도 물들 수 있는 무한한 가능성. 편견 없는 시선으로 세상을 바라보며, 자신만의 바탕색을 정직하게 지켜가는 네가 자랑스러워!",
              color: "#f5f5f5",
              stroke: PAINT_STROKES.white
            },
            { 
              name: "딥 세이지 그린", 
              keyword: "회복력 & 조화", 
              desc: "자연처럼 주변과 조화를 이루며 살아가는 따뜻함. 지친 타인을 치유해주고, 스스로도 단단하게 뿌리 내리는 평온한 삶이 아름다워!",
              color: "#768d74",
              stroke: PAINT_STROKES.green
            },
            { 
              name: "선셋 오렌지", 
              keyword: "창의성 & 유머", 
              desc: "틀에 박히지 않은 즐거움과 넘치는 에너지를 가진 사람. 어디에 있든 분위기를 밝게 만들고 위트를 잃지 않는 낙천적인 너를 보면 기분이 좋아!",
              color: "#f27d26",
              stroke: PAINT_STROKES.orange
            },
            { 
              name: "일렉트릭 블루", 
              keyword: "지성 & 혁신", 
              desc: "냉철한 이성과 예리한 통찰력을 가진 리더. 익숙한 것에 의문을 던지고 새로운 미래를 설계하는 지적인 삶을 도모하는 네가 참 멋져!",
              color: "#3b82f6",
              stroke: PAINT_STROKES.blue
            },
            { 
              name: "우드 브라운", 
              keyword: "기본 & 신뢰", 
              desc: "시간이 흘러도 변치 않는 고전적인 가치를 아는 사람. 화려하지 않아도 묵묵히 자신의 자리를 지키며 타인에게 신뢰를 주는 단단한 네가 되길 축복해!",
              color: "#8d7b68",
              stroke: PAINT_STROKES.brown
            },
            { 
              name: "라벤더 퍼플", 
              keyword: "이상 & 감동", 
              desc: "남들이 보지 못하는 꿈을 꾸고, 그 상상을 현실로 만들어내는 낭만가. 현실과 이상 사이의 다리가 되어 사람들에게 감동을 선사하는 멋진 너의 삶을 응원해!",
              color: "#a78bfa",
              stroke: PAINT_STROKES.purple
            }
          ].map((color, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="w-16 h-16 flex-shrink-0 relative">
                <img src={color.stroke} className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{color.name}</span>
                  <span className="text-[11px] text-gray-500 font-bold">{color.keyword}</span>
                </div>
                <p className="text-[0.8rem] text-gray-600 leading-relaxed">
                  "{color.desc}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 8페이지: 돌잡이 이벤트 및 방명록 (UPDATED) */}
      <section id="page8" className="w-full min-h-screen flex flex-col items-center p-5 py-20 text-center bg-[#fdfaf7] relative overflow-hidden">
        {/* Decorative paint strokes */}
        <div className="absolute top-[-20px] right-[-20px] w-48 h-48 opacity-30 rotate-[20deg] pointer-events-none">
          <img src="images/orange.png" className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
        </div>
        <div className="absolute top-[10%] left-[-30px] w-40 h-40 opacity-30 rotate-[-15deg] pointer-events-none">
          <img src="images/blue.png" className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
        </div>

        <motion.h2 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-[1.3rem] mb-[30px] text-[#8d7b68] font-bold"
        >
          돌잡이 이벤트 참여
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="space-y-2 mb-12"
        >
          <h2 className="text-[2.2rem] font-black tracking-tight leading-tight">
            <span className="text-[#f27d26]">제희</span>가 선택할
          </h2>
          <h2 className="text-[2.2rem] font-black tracking-tight leading-tight">
            <span className="text-[#2d5a27]">컬러</span>를 맞혀주세요!
          </h2>
          <p className="text-[1rem] font-bold text-gray-700 pt-2">
            맞히시는 분께 소정의 상품을 드립니다.
          </p>
        </motion.div>

        {/* Guestbook Form */}
        <div className="w-full max-w-[400px] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-12">
          <h3 className="text-[1.1rem] font-black mb-6 text-left border-l-4 border-black pl-3">
            방명록 남기기
          </h3>
          <form onSubmit={handleGuestbookSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="이름" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#f27d26] outline-none font-bold text-sm"
                required
              />
            </div>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-4 text-gray-400" size={18} />
              <textarea 
                placeholder="제희에게 축하 메시지를 남겨주세요! (예: 제희야 생일 축하해! 돌잡이는 오렌지!)" 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#f27d26] outline-none font-bold text-sm min-h-[100px] resize-none"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {isSubmitting ? "전송 중..." : <><Send size={18} /> 메시지 남기기</>}
            </button>
          </form>
        </div>

        {/* Guestbook List */}
        <div className="w-full max-w-[400px] text-left">
          <h3 className="text-[1.1rem] font-black mb-6 border-l-4 border-[#f27d26] pl-3">
            방명록 리스트 ({entries.length})
          </h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {entries.length === 0 ? (
              <p className="text-center py-10 text-gray-400 font-bold">첫 번째 방명록을 남겨주세요!</p>
            ) : (
              entries.map((entry) => (
                <motion.div 
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-[#f27d26]">{entry.name}</span>
                    <span className="text-[10px] text-gray-400">
                      {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-bold leading-relaxed">
                    {entry.content}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 9페이지: 돌잔치 안내 (NEW) */}
      <section id="page9" className="w-full min-h-screen flex flex-col items-center justify-center p-5 text-center bg-white relative overflow-hidden">
        {/* Decorative paint strokes */}
        <div className="absolute top-[-20px] left-[-20px] w-48 h-48 opacity-20 rotate-[-15deg]">
          <img src="images/green.png" className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
        </div>
        <div className="absolute bottom-[-20px] right-[-20px] w-48 h-48 opacity-20 rotate-[15deg]">
          <img src="images/purple.png" className="w-full h-full object-contain" alt="" referrerPolicy="no-referrer" />
        </div>

        <motion.h2 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="text-[1.3rem] mb-[30px] text-[#8d7b68] font-bold"
        >
          제희 돌잔치 안내
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="space-y-6 mb-12"
        >
          <div className="space-y-2">
            <p className="text-[1.1rem] text-gray-500 font-bold">Online Google Meet</p>
            <h2 className="text-[2.5rem] font-black text-[#1a1a1a] leading-tight">
              제희의 첫 돌잔치에<br />초대합니다
            </h2>
          </div>

          <div className="bg-[#fdfaf7] p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 max-w-[340px] mx-auto">
            <div className="flex flex-col gap-1">
              <span className="text-[0.8rem] text-[#f27d26] font-bold uppercase tracking-wider">Date</span>
              <p className="text-[1.2rem] font-black text-gray-800">2026년 4월 17일 (금요일)</p>
            </div>
            <div className="w-full h-[1px] bg-gray-200"></div>
            <div className="flex flex-col gap-1">
              <span className="text-[0.8rem] text-[#f27d26] font-bold uppercase tracking-wider">Time</span>
              <p className="text-[1.2rem] font-black text-gray-800">18:00 ~ 18:30 (KST)</p>
            </div>
          </div>

          <p className="text-[0.9rem] text-gray-500 font-bold">
            *돌잔치 참여 전 방명록을 남겨주세요! :)
          </p>
        </motion.div>

        <motion.a
          href="https://meet.google.com/zty-ucoe-ext"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#f27d26] text-white px-10 py-5 rounded-full font-black text-[1.2rem] shadow-lg shadow-orange-200 flex items-center gap-3"
        >
          돌잔치 참여하기
        </motion.a>
      </section>

      <footer className="w-full py-10 text-center text-[0.8rem] text-[#aaa] bg-white">
        Happy Jehee's 1st Birthday
      </footer>

      {/* 모달 */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/95 flex justify-center items-center p-4"
            onClick={closeModal}
          >
            <div className="relative w-full max-w-[500px] text-center" onClick={(e) => e.stopPropagation()}>
              <button 
                className="absolute top-[-60px] right-0 text-white text-[45px] hover:text-gray-300 transition-colors"
                onClick={closeModal}
              >
                <X size={40} />
              </button>
              
              <button 
                className="absolute top-1/2 left-[-40px] translate-y-[-50%] text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                onClick={() => changeImage(-1)}
              >
                <ChevronLeft size={40} />
              </button>

              <motion.img 
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={IMAGES[currentIndex]} 
                className="w-full rounded-[4px] max-h-[80vh] object-contain"
                alt={`추억 확대 ${currentIndex + 1}`}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/jehee-${currentIndex}/800/800`;
                }}
              />

              <button 
                className="absolute top-1/2 right-[-40px] translate-y-[-50%] text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                onClick={() => changeImage(1)}
              >
                <ChevronRight size={40} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
