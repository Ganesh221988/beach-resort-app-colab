export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'owner' | 'broker';
  avatar?: string;
}

export interface SocialMediaAccounts {
  facebook?: {
    pageId: string;
    accessToken: string;
    pageName: string;
  };
  instagram?: {
    accountId: string;
    accessToken: string;
    username: string;
  };
}

export interface MailchimpConfig {
  apiKey?: string;
  listId?: string;
  connected: boolean;
  lastSync?: string;
}

export interface UserSettings {
  userId: string;
  mailchimp: MailchimpConfig;
  socialMedia: SocialMediaAccounts;
  autoPostConfig: {
    frequency: 'daily' | 'weekly';
    time: string;
    enabled: boolean;
    lastPosted?: string;
  };
}

export interface ProfileUpdateData {
  name: string;
  email: string;
  phone: string;
  avatar?: File;
}

export interface AutoPostTemplate {
  id: string;
  name: string;
  template: string;
  variables: string[];
  enabled: boolean;
  lastUsed?: string;
}
