// src/components/Logo.tsx
import logo from "@/assets/logo.png";

interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export const Logo = ({ className = "h-12 w-auto", onClick }: LogoProps) => {
  return (
    <img 
      src={logo} 
      alt="MetroMeet Logo" 
      className={className}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
};