import { Icon } from '@iconify/react';
import { parseAvatar, AvatarConfig } from '../utils/avatar-generator';

interface AvatarProps {
  avatar: string | AvatarConfig | undefined;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 40,
  md: 60,
  lg: 80,
};

export function Avatar({ avatar, size = 'md', className = '' }: AvatarProps) {
  const avatarConfig = parseAvatar(avatar);
  const px = sizeMap[size];

  return (
    <div
      className={`flex items-center justify-center rounded-full ${className}`}
      style={{
        width: px,
        height: px,
        backgroundColor: avatarConfig.color,
      }}
    >
      <Icon
        icon={avatarConfig.name}
        width={px * 0.6}
        height={px * 0.6}
        color="white"
      />
    </div>
  );
}
