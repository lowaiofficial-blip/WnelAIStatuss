import bannerImg from '../assets/images/status_banner_1787220125570.jpg';

export function StatusBanner() {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs relative group">
      <div className="relative w-full aspect-[21/9] sm:aspect-[24/8] max-h-[220px] overflow-hidden bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <img
          src={bannerImg}
          alt="WnelAI Systems Engineering & Status Illustration"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center dark:opacity-90 dark:brightness-90 transition-opacity"
        />
        
        {/* Soft gradient edge fade into container */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
