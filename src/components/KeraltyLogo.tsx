import keraltyLogo from "@/assets/keralty-logo.png";

const KeraltyLogo = ({ className = "h-[60px]" }: { className?: string }) => (
  <img src={keraltyLogo} alt="Keralty" className={className} />
);

export default KeraltyLogo;
