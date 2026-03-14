import Image from "next/image";

export function EmptyState() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4">
      <Image
        src="/static/assets/images/bobba.png"
        alt="Bobba"
        width={297}
        height={296}
        loading="eager"
      />
      <p className="text-2xl font-normal leading-[100%] text-[#88642A]">
        I&apos;m just here waiting for your charming notes...
      </p>
    </div>
  );
}
