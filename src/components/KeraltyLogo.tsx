import keraltyLogo from "@/assets/keralty-logo.png";

const KeraltyLogo = ({ className = "w-full object-contain" }: { className?: string }) => (
  <img src={keraltyLogo} alt="Keralty" className={className} />
);

export default KeraltyLogo;
