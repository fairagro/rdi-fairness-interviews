import InfoIcon from '@mui/icons-material/Info';
import PublicIcon from '@mui/icons-material/Public';
import SearchIcon from '@mui/icons-material/Search';
import SchemaIcon from '@mui/icons-material/Schema';
import StorageIcon from '@mui/icons-material/Storage';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import HubIcon from '@mui/icons-material/Hub';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LinkIcon from '@mui/icons-material/Link';
import ApiIcon from '@mui/icons-material/Api';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GavelIcon from '@mui/icons-material/Gavel';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import GroupsIcon from '@mui/icons-material/Groups';
import DescriptionIcon from '@mui/icons-material/Description';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import HelpIcon from '@mui/icons-material/Help';
import { SvgIconProps } from '@mui/material/SvgIcon';
import { ComponentType } from 'react';

const iconMap: Record<string, ComponentType<SvgIconProps>> = {
  InfoIcon,
  PublicIcon,
  SearchIcon,
  SchemaIcon,
  StorageIcon,
  CloudDownloadIcon,
  LockIcon,
  VpnKeyIcon,
  EventAvailableIcon,
  CloudDoneIcon,
  HubIcon,
  LibraryBooksIcon,
  LinkIcon,
  ApiIcon,
  InsertDriveFileIcon,
  GavelIcon,
  HistoryEduIcon,
  GroupsIcon,
  DescriptionIcon,
  FormatQuoteIcon,
};

export function getIconComponent(iconName: string): ComponentType<SvgIconProps> {
  return iconMap[iconName] || HelpIcon;
}
