import { generateMeta } from "@/lib/seo";
import { Mail, MessageSquare } from "lucide-react";
import { DraftNotice, InfoLayout } from "@/components/common/InfoLayout";

export const metadata = generateMeta({
  title: "İletişim",
  description: "YetişVar ile iletişime geçin. Cevap, düzeltme veya içerik kaldırma talebinde bulunun.",
  path: "/iletisim",
});

const CHANNELS = [
  {
    icon: MessageSquare,
    title: "Cevap veya Düzeltme Talebi",
    desc: "Platformda hakkınızda yer alan bir içeriğe itiraz etmek, düzeltme talep etmek veya cevap hakkınızı kullanmak istiyorsanız lütfen ilgili içeriğin başlığı ve URL'sini belirterek yazın.",
  },
  {
    icon: Mail,
    title: "Genel Yazışma",
    desc: "Platform hakkında genel sorularınız, iş birliği teklifleri veya basın talepleri için aşağıdaki adrese yazabilirsiniz.",
  },
];

export default function IletisimPage() {
  return (
    <InfoLayout
      path="/iletisim"
      title="İletişim"
      lead="Sorularınız, düzeltme talepleriniz veya cevap hakkınızı kullanmak için aşağıdaki kanalları kullanabilirsiniz."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {CHANNELS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card flex flex-col p-6">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-soft text-brand">
              <Icon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-extrabold text-navy">{title}</h2>
            <p className="mt-1.5 flex-1 text-sm leading-6 text-muted">{desc}</p>
            <div className="mt-5 border-t border-line pt-4">
              <p className="text-sm font-bold text-brand">iletisim@yetisvar.com</p>
              <p className="mt-0.5 text-xs text-subtle">(Demo aşamasında e-posta aktif değildir)</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <DraftNotice>
          Platform henüz geliştirme aşamasındadır. Bu sayfadaki iletişim bilgileri gerçek başvuru
          sistemi aktif olduğunda güncellenecektir.
        </DraftNotice>
      </div>
    </InfoLayout>
  );
}
