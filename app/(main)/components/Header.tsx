'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/app/store/userStore';
import Avatar from 'boring-avatars';
import { avatarColor, pages } from '@/app/lib/common';
import Link from 'next/link';
import UserInfo from './common/UserInfo';

const Header = React.memo(function Header() {
  const userId = useUserStore((state) => state.userId);
  const [openHover, setOpenHover] = useState(false);

  // const userSection = useMemo(() => {
  //   if (userId) {
  //     return (
  //       <div className="flex items-center gap-2">
  //         {/* <div className="text-xl font-extrabold">{userId}</div> */}
  //         <button onClick={() => setOpenHover(true)}>
  //           <Avatar
  //             colors={avatarColor}
  //             size={32}
  //             variant="beam"
  //             name={userId}
  //           />
  //         </button>
  //         <UserInfo
  //           userId={userId}
  //           openHover={openHover}
  //           setOpenHover={setOpenHover}
  //         />
  //       </div>
  //     );
  //   }
  //   return (
  //     <div className="flex animate-pulse items-center gap-2 transition-all">
  //       <div className="size-8 rounded-full bg-gray-400" />
  //       {/* <div className="h-4 w-14 rounded-lg bg-gray-400" /> */}
  //     </div>
  //   );
  // }, [userId]);

  return (
    <div className="absolute top-0 z-[9999] w-screen border-b bg-gray-50">
      <div className="container mx-auto flex h-12 w-full items-center justify-between gap-2 px-4">
        {/* links */}
        <div className="flex gap-4 uppercase">
          {pages.map((item) => (
            <Link key={item.path} href={item.path} className="cursor-pointer">
              {item.name}
            </Link>
          ))}
        </div>
        {/* {userSection} */}
        {userId ? (
          <div className="flex items-center gap-2">
            {/* <div className="text-xl font-extrabold">{userId}</div> */}
            <button
              className="cursor-pointer"
              onClick={() => setOpenHover(!openHover)}
            >
              <Avatar
                colors={avatarColor}
                size={32}
                variant="beam"
                name={userId}
              />
            </button>
            <UserInfo
              userId={userId}
              openHover={openHover}
              setOpenHover={setOpenHover}
            />
          </div>
        ) : (
          <div className="flex animate-pulse items-center gap-2 transition-all">
            <div className="size-8 rounded-full bg-gray-400" />
            {/* <div className="h-4 w-14 rounded-lg bg-gray-400" /> */}
          </div>
        )}
      </div>
    </div>
  );
});

export default Header;
