export type Language = 'tr' | 'en'

export interface Translations {
    // Navigation
    navigation: {
        inbox: string
        dialer: string
        crm: string
        pipeline: string
        flows: string
        insights: string
        studio: string
        settings: string
    }

    // Common
    common: {
        search: string
        add: string
        new: string
        edit: string
        delete: string
        save: string
        cancel: string
        close: string
        back: string
        next: string
        previous: string
        loading: string
        error: string
        success: string
        warning: string
        info: string
    }

    // Dialer
    dialer: {
        title: string
        status: string
        active: string
        paused: string
        callQueue: string
        recentActivity: string
        campaignProgress: string
        callsCompleted: string
        connectionRate: string
        callbacksScheduled: string
        nextCall: string
        activeCampaign: string
        addContact: string
        pauseDialer: string
        newCampaign: string
        searchContacts: string
        connected: string
        voicemailLeft: string
        noAnswer: string
        viewLog: string
    }

    // CRM Pipeline
    crm: {
        title: string
        searchDeals: string
        newDeal: string
        assignedUser: string
        dateRange: string
        tags: string
        leadIn: string
        contactMade: string
        meetingScheduled: string
        proposal: string
        won: string
        dragDealsHere: string
    }

    // Settings
    settings: {
        title: string
        description: string
        myProfile: string
        preferences: string
        notifications: string
        integrations: string
        billing: string
        personalInfo: string
        personalInfoDesc: string
        firstName: string
        lastName: string
        role: string
        password: string
        passwordDesc: string
        currentPassword: string
        newPassword: string
        uploadNewPicture: string
        saveChanges: string
    }
}

export const translations: Record<Language, Translations> = {
    tr: {
        navigation: {
            inbox: 'Gelen Kutusu',
            dialer: 'Arayıcı',
            crm: 'CRM',
            pipeline: 'Pipeline',
            flows: 'Akışlar',
            insights: 'İçgörüler',
            studio: 'Stüdyo',
            settings: 'Ayarlar'
        },
        common: {
            search: 'Ara',
            add: 'Ekle',
            new: 'Yeni',
            edit: 'Düzenle',
            delete: 'Sil',
            save: 'Kaydet',
            cancel: 'İptal',
            close: 'Kapat',
            back: 'Geri',
            next: 'İleri',
            previous: 'Önceki',
            loading: 'Yükleniyor...',
            error: 'Hata',
            success: 'Başarılı',
            warning: 'Uyarı',
            info: 'Bilgi'
        },
        dialer: {
            title: 'AI Arayıcı',
            status: 'ARAYICI DURUMU',
            active: 'Arayıcı Aktif',
            paused: 'Arayıcı Duraklatıldı',
            callQueue: 'Arama Kuyruğu',
            recentActivity: 'Son Aktiviteler',
            campaignProgress: 'Kampanya İlerlemesi',
            callsCompleted: 'Tamamlanan Aramalar',
            connectionRate: 'Bağlantı Oranı',
            callbacksScheduled: 'Planlanan Geri Aramalar',
            nextCall: 'Sonraki arama:',
            activeCampaign: 'Aktif Kampanya:',
            addContact: 'Kişi Ekle',
            pauseDialer: 'Arayıcıyı Duraklat',
            newCampaign: 'Yeni Kampanya',
            searchContacts: 'Kişileri ara...',
            connected: 'Bağlandı',
            voicemailLeft: 'Sesli Mesaj Bırakıldı',
            noAnswer: 'Cevap Yok',
            viewLog: 'Günlüğü Görüntüle'
        },
        crm: {
            title: 'CRM & Pipeline',
            searchDeals: 'Anlaşmaları, kişileri ara...',
            newDeal: 'Yeni Anlaşma',
            assignedUser: 'Atanan Kullanıcı',
            dateRange: 'Tarih Aralığı',
            tags: 'Etiketler',
            leadIn: 'Gelen Lead',
            contactMade: 'İletişim Kuruldu',
            meetingScheduled: 'Toplantı Planlandı',
            proposal: 'Teklif',
            won: 'Kazanıldı',
            dragDealsHere: 'Anlaşmaları buraya sürükleyin'
        },
        settings: {
            title: 'Ayarlar',
            description: 'Profilinizi, tercihlerinizi ve çalışma alanı ayarlarınızı yönetin.',
            myProfile: 'Profilim',
            preferences: 'Tercihler',
            notifications: 'Bildirimler',
            integrations: 'Entegrasyonlar',
            billing: 'Faturalandırma',
            personalInfo: 'Kişisel Bilgiler',
            personalInfoDesc: 'Kişisel detaylarınızı buradan güncelleyin.',
            firstName: 'Ad',
            lastName: 'Soyad',
            role: 'Rol',
            password: 'Şifre',
            passwordDesc: 'Şifre ayarlarınızı yönetin.',
            currentPassword: 'Mevcut Şifre',
            newPassword: 'Yeni Şifre',
            uploadNewPicture: 'Yeni resim yükle',
            saveChanges: 'Değişiklikleri Kaydet'
        }
    },
    en: {
        navigation: {
            inbox: 'Inbox',
            dialer: 'Dialer',
            crm: 'CRM',
            pipeline: 'Pipeline',
            flows: 'Flows',
            insights: 'Insights',
            studio: 'Studio',
            settings: 'Settings'
        },
        common: {
            search: 'Search',
            add: 'Add',
            new: 'New',
            edit: 'Edit',
            delete: 'Delete',
            save: 'Save',
            cancel: 'Cancel',
            close: 'Close',
            back: 'Back',
            next: 'Next',
            previous: 'Previous',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            warning: 'Warning',
            info: 'Info'
        },
        dialer: {
            title: 'AI Dialer',
            status: 'DIALER STATUS',
            active: 'Dialer is Active',
            paused: 'Dialer is Paused',
            callQueue: 'Call Queue',
            recentActivity: 'Recent Activity',
            campaignProgress: 'Campaign Progress',
            callsCompleted: 'Calls Completed',
            connectionRate: 'Connection Rate',
            callbacksScheduled: 'Callbacks Scheduled',
            nextCall: 'Next call:',
            activeCampaign: 'Active Campaign:',
            addContact: 'Add Contact',
            pauseDialer: 'Pause Dialer',
            newCampaign: 'New Campaign',
            searchContacts: 'Search contacts...',
            connected: 'Connected',
            voicemailLeft: 'Voicemail Left',
            noAnswer: 'No Answer',
            viewLog: 'View Log'
        },
        crm: {
            title: 'CRM & Pipeline',
            searchDeals: 'Search deals, contacts...',
            newDeal: 'New Deal',
            assignedUser: 'Assigned User',
            dateRange: 'Date Range',
            tags: 'Tags',
            leadIn: 'Lead In',
            contactMade: 'Contact Made',
            meetingScheduled: 'Meeting Scheduled',
            proposal: 'Proposal',
            won: 'Won',
            dragDealsHere: 'Drag deals here'
        },
        settings: {
            title: 'Settings',
            description: 'Manage your profile, preferences, and workspace settings.',
            myProfile: 'My Profile',
            preferences: 'Preferences',
            notifications: 'Notifications',
            integrations: 'Integrations',
            billing: 'Billing',
            personalInfo: 'Personal Information',
            personalInfoDesc: 'Update your personal details here.',
            firstName: 'First Name',
            lastName: 'Last Name',
            role: 'Role',
            password: 'Password',
            passwordDesc: 'Manage your password settings.',
            currentPassword: 'Current Password',
            newPassword: 'New Password',
            uploadNewPicture: 'Upload new picture',
            saveChanges: 'Save Changes'
        }
    }
}
