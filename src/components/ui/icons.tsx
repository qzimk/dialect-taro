import { type ViewProps } from '@tarojs/components'
import { Icon, type IconName } from './icon'

interface ShimProps extends Omit<ViewProps, 'name'> {
  className?: string
  size?: number
  color?: string
  strokeWidth?: number
}

const SCALE: Record<string, number> = {
  '2.5': 10, '3': 12, '3.5': 14, '4': 16, '4.5': 18, '5': 20,
  '6': 24, '7': 28, '8': 32, '9': 36, '10': 40, '12': 48, '14': 56, '16': 64,
}

// 原 lucide 调用点用 w-5/h-5 这类工具类定尺寸，小程序里由内联尺寸接管。
function sizeFromClassName(className = '') {
  const m = /(?:^|\s)[wh]-(\d+(?:\.\d)?)(?:\s|$)/.exec(className)
  return m ? SCALE[m[1]] ?? 16 : 16
}

function makeIcon(name: IconName) {
  return function LucideIcon({ className, color, ...rest }: ShimProps) {
    const resolved = color ?? (/(?:^|\s)text-white(?:\s|$)/.test(className || '') ? '#ffffff' : '#252525')
    return <Icon name={name} size={sizeFromClassName(className)} color={resolved} className={className} {...rest} />
  }
}

export const Send = makeIcon('Send')
export const Mic = makeIcon('Mic')
export const Volume2 = makeIcon('Volume2')
export const Volume1 = makeIcon('Volume1')
export const VolumeX = makeIcon('VolumeX')
export const Copy = makeIcon('Copy')
export const RefreshCw = makeIcon('RefreshCw')
export const Languages = makeIcon('Languages')
export const Square = makeIcon('Square')
export const Users = makeIcon('Users')
export const Settings = makeIcon('Settings')
export const X = makeIcon('X')
export const Search = makeIcon('Search')
export const Filter = makeIcon('Filter')
export const Trash2 = makeIcon('Trash2')
export const MessageSquare = makeIcon('MessageSquare')
export const MessageCircle = makeIcon('MessageCircle')
export const BookText = makeIcon('BookText')
export const BookmarkPlus = makeIcon('BookmarkPlus')
export const Bookmark = makeIcon('Bookmark')
export const BookOpen = makeIcon('BookOpen')
export const BookMarked = makeIcon('BookMarked')
export const History = makeIcon('History')
export const Plus = makeIcon('Plus')
export const Play = makeIcon('Play')
export const Pause = makeIcon('Pause')
export const Radio = makeIcon('Radio')
export const Check = makeIcon('Check')
export const Check_ = Check
export const ChevronDown = makeIcon('ChevronDown')
export const ChevronUp = makeIcon('ChevronUp')
export const ChevronLeft = makeIcon('ChevronLeft')
export const ChevronRight = makeIcon('ChevronRight')
export const ArrowLeft = makeIcon('ArrowLeft')
export const ArrowRight = makeIcon('ArrowRight')
export const Lightbulb = makeIcon('Lightbulb')
export const ExternalLink = makeIcon('ExternalLink')
export const User = makeIcon('User')
export const Bot = makeIcon('Bot')
export const MoreHorizontal = makeIcon('MoreHorizontal')
export const Paperclip = makeIcon('Paperclip')
export const CircleDot = makeIcon('CircleDot')
export const StopCircle = makeIcon('StopCircle')
export const Bell = makeIcon('Bell')
export const CheckCheck = makeIcon('CheckCheck')
export const Database = makeIcon('Database')
export const FileText = makeIcon('FileText')
export const Globe = makeIcon('Globe')
export const GraduationCap = makeIcon('GraduationCap')
export const Heart = makeIcon('Heart')
export const Info = makeIcon('Info')
export const Loader2 = makeIcon('Loader2')
export const Mail = makeIcon('Mail')
export const Shield = makeIcon('Shield')
export const Star = makeIcon('Star')
export const UserMinus = makeIcon('UserMinus')
export const UserPlus = makeIcon('UserPlus')
export const Video = makeIcon('Video')
export const Download = makeIcon('Download')
export const Clock = makeIcon('Clock')
export const CheckCircle = makeIcon('CheckCircle')
export const Lock = makeIcon('Lock')
export const PenLine = makeIcon('PenLine')
export const Headphones = makeIcon('Headphones')
export const ListChecks = makeIcon('ListChecks')
export const Trophy = makeIcon('Trophy')
export const RotateCcw = makeIcon('RotateCcw')
export const Maximize = makeIcon('Maximize')
export const Minimize = makeIcon('Minimize')
export const ThumbsUp = makeIcon('ThumbsUp')
export const Keyboard = makeIcon('Keyboard')
export const AudioLines = makeIcon('AudioLines')
export const Type = makeIcon('Type')
