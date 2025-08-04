import Image from "next/image";

export default function CourseImg({imgs=[]}){
    return(
        <div className="flex flex-wrap gap-6 max-w-[1148]">
        {imgs.map((img)=>{
            return(
                <Image
                    key={img.id}
                    width={540}
                    height={350}
                    src={img.src}
                    alt={img.alt}
                    className="w-[calc(50%-12px)]" // 50% 減去 gap 的一半
                />
            )
        })}
        </div>
    )
}