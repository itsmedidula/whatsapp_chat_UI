import { ArrowLeft, MoreVertical, Phone, Video, ShieldCheck } from 'lucide-react';

interface ChatHeaderProps {
  name: string;
  isVerified: boolean;
  avatar: string;
}

export function ChatHeader({ name, isVerified, avatar }: ChatHeaderProps) {
  return (
    <div className="bg-[#008069] px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <ArrowLeft className="w-6 h-6 text-white cursor-pointer" />
        <div className="flex items-center gap-3">
          <img 
            src={avatar} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover border border-white/20"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="text-white font-medium text-lg leading-none">{name}</h1>
              {isVerified && (
                <ShieldCheck className="w-4 h-4 text-[#25D366] fill-white" />
              )}
            </div>
            <p className="text-white/80 text-xs">Business Account</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-5 text-white">
        <Video className="w-6 h-6 cursor-pointer" />
        <Phone className="w-6 h-6 cursor-pointer" />
        <MoreVertical className="w-6 h-6 cursor-pointer" />
      </div>
    </div>
  );
}
