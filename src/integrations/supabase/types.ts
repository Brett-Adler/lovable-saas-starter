export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      about_page: {
        Row: {
          cta_body: string | null
          cta_primary_href: string | null
          cta_primary_label: string | null
          cta_secondary_href: string | null
          cta_secondary_label: string | null
          cta_title: string | null
          eyebrow: string | null
          headline: string | null
          id: number
          milestones_title: string | null
          mission_body: string | null
          mission_title: string | null
          press_title: string | null
          primary_cta_href: string | null
          primary_cta_label: string | null
          secondary_cta_href: string | null
          secondary_cta_label: string | null
          show_cta: boolean
          show_milestones: boolean
          show_mission: boolean
          show_press: boolean
          show_stats: boolean
          show_story: boolean
          show_team: boolean
          show_values: boolean
          stats_title: string | null
          story_body: string | null
          story_image_url: string | null
          story_title: string | null
          subhead: string | null
          team_subtitle: string | null
          team_title: string | null
          updated_at: string
          values_title: string | null
          vision_body: string | null
          vision_title: string | null
        }
        Insert: {
          cta_body?: string | null
          cta_primary_href?: string | null
          cta_primary_label?: string | null
          cta_secondary_href?: string | null
          cta_secondary_label?: string | null
          cta_title?: string | null
          eyebrow?: string | null
          headline?: string | null
          id?: number
          milestones_title?: string | null
          mission_body?: string | null
          mission_title?: string | null
          press_title?: string | null
          primary_cta_href?: string | null
          primary_cta_label?: string | null
          secondary_cta_href?: string | null
          secondary_cta_label?: string | null
          show_cta?: boolean
          show_milestones?: boolean
          show_mission?: boolean
          show_press?: boolean
          show_stats?: boolean
          show_story?: boolean
          show_team?: boolean
          show_values?: boolean
          stats_title?: string | null
          story_body?: string | null
          story_image_url?: string | null
          story_title?: string | null
          subhead?: string | null
          team_subtitle?: string | null
          team_title?: string | null
          updated_at?: string
          values_title?: string | null
          vision_body?: string | null
          vision_title?: string | null
        }
        Update: {
          cta_body?: string | null
          cta_primary_href?: string | null
          cta_primary_label?: string | null
          cta_secondary_href?: string | null
          cta_secondary_label?: string | null
          cta_title?: string | null
          eyebrow?: string | null
          headline?: string | null
          id?: number
          milestones_title?: string | null
          mission_body?: string | null
          mission_title?: string | null
          press_title?: string | null
          primary_cta_href?: string | null
          primary_cta_label?: string | null
          secondary_cta_href?: string | null
          secondary_cta_label?: string | null
          show_cta?: boolean
          show_milestones?: boolean
          show_mission?: boolean
          show_press?: boolean
          show_stats?: boolean
          show_story?: boolean
          show_team?: boolean
          show_values?: boolean
          stats_title?: string | null
          story_body?: string | null
          story_image_url?: string | null
          story_title?: string | null
          subhead?: string | null
          team_subtitle?: string | null
          team_title?: string | null
          updated_at?: string
          values_title?: string | null
          vision_body?: string | null
          vision_title?: string | null
        }
        Relationships: []
      }
      about_people: {
        Row: {
          bio: string | null
          created_at: string
          group_key: string
          id: string
          links: Json
          name: string
          photo_url: string | null
          position: number
          published: boolean
          role: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          group_key?: string
          id?: string
          links?: Json
          name: string
          photo_url?: string | null
          position?: number
          published?: boolean
          role?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          group_key?: string
          id?: string
          links?: Json
          name?: string
          photo_url?: string | null
          position?: number
          published?: boolean
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      about_sections: {
        Row: {
          body: string | null
          created_at: string
          icon: string | null
          id: string
          image_url: string | null
          kind: Database["public"]["Enums"]["about_section_kind"]
          link_url: string | null
          meta: Json
          position: number
          published: boolean
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          kind: Database["public"]["Enums"]["about_section_kind"]
          link_url?: string | null
          meta?: Json
          position?: number
          published?: boolean
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          image_url?: string | null
          kind?: Database["public"]["Enums"]["about_section_kind"]
          link_url?: string | null
          meta?: Json
          position?: number
          published?: boolean
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          anonymous_id: string | null
          created_at: string
          event_name: string
          id: string
          ip_country: string | null
          properties: Json
          referrer: string | null
          session_id: string | null
          url: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          event_name: string
          id?: string
          ip_country?: string | null
          properties?: Json
          referrer?: string | null
          session_id?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          event_name?: string
          id?: string
          ip_country?: string | null
          properties?: Json
          referrer?: string | null
          session_id?: string | null
          url?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_email: string | null
          actor_user_id: string | null
          created_at: string
          id: string
          ip_address: unknown
          metadata: Json
          organization_id: string | null
          target_id: string | null
          target_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          organization_id?: string | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_user_id?: string | null
          created_at?: string
          id?: string
          ip_address?: unknown
          metadata?: Json
          organization_id?: string | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string | null
          category_id: string | null
          content_md: string
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          category_id?: string | null
          content_md?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          category_id?: string | null
          content_md?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          kind: Database["public"]["Enums"]["lead_kind"]
          message: string | null
          name: string | null
          notes: string | null
          phone: string | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          utm: Json
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          kind?: Database["public"]["Enums"]["lead_kind"]
          message?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          utm?: Json
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          kind?: Database["public"]["Enums"]["lead_kind"]
          message?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          utm?: Json
        }
        Relationships: []
      }
      marketing_campaign_recipients: {
        Row: {
          campaign_id: string
          created_at: string
          email: string
          error: string | null
          id: string
          provider_message_id: string | null
          sent_at: string | null
          status: string
          subscriber_id: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string
          email: string
          error?: string | null
          id?: string
          provider_message_id?: string | null
          sent_at?: string | null
          status?: string
          subscriber_id?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string
          email?: string
          error?: string | null
          id?: string
          provider_message_id?: string | null
          sent_at?: string | null
          status?: string
          subscriber_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaign_recipients_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "marketing_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_campaign_recipients_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "marketing_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_campaigns: {
        Row: {
          body_html: string | null
          body_text: string | null
          created_at: string
          created_by: string | null
          from_email: string | null
          from_name: string | null
          id: string
          name: string
          preheader: string | null
          reply_to: string | null
          scheduled_at: string | null
          segment_id: string | null
          sent_at: string | null
          stats: Json
          status: Database["public"]["Enums"]["campaign_status"]
          subject: string
          updated_at: string
        }
        Insert: {
          body_html?: string | null
          body_text?: string | null
          created_at?: string
          created_by?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: string
          name: string
          preheader?: string | null
          reply_to?: string | null
          scheduled_at?: string | null
          segment_id?: string | null
          sent_at?: string | null
          stats?: Json
          status?: Database["public"]["Enums"]["campaign_status"]
          subject: string
          updated_at?: string
        }
        Update: {
          body_html?: string | null
          body_text?: string | null
          created_at?: string
          created_by?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: string
          name?: string
          preheader?: string | null
          reply_to?: string | null
          scheduled_at?: string | null
          segment_id?: string | null
          sent_at?: string | null
          stats?: Json
          status?: Database["public"]["Enums"]["campaign_status"]
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "marketing_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_segments: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          filter: Json
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          filter?: Json
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          filter?: Json
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketing_subscribers: {
        Row: {
          confirmation_token: string | null
          confirmed_at: string | null
          consent_ip: unknown
          consent_text: string | null
          consent_user_agent: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          source: string | null
          status: Database["public"]["Enums"]["subscriber_status"]
          subscribed_at: string
          tags: string[]
          unsubscribe_token: string
          unsubscribed_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          confirmation_token?: string | null
          confirmed_at?: string | null
          consent_ip?: unknown
          consent_text?: string | null
          consent_user_agent?: string | null
          created_at?: string
          email: string
          id?: string
          name?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["subscriber_status"]
          subscribed_at?: string
          tags?: string[]
          unsubscribe_token?: string
          unsubscribed_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          confirmation_token?: string | null
          confirmed_at?: string | null
          consent_ip?: unknown
          consent_text?: string | null
          consent_user_agent?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["subscriber_status"]
          subscribed_at?: string
          tags?: string[]
          unsubscribe_token?: string
          unsubscribed_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_marketing: boolean
          email_product: boolean
          email_security: boolean
          in_app_enabled: boolean
          push_enabled: boolean
          sms_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_marketing?: boolean
          email_product?: boolean
          email_security?: boolean
          in_app_enabled?: boolean
          push_enabled?: boolean
          sms_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_marketing?: boolean
          email_product?: boolean
          email_security?: boolean
          in_app_enabled?: boolean
          push_enabled?: boolean
          sms_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          icon: string | null
          id: string
          link: string | null
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      org_sso_config: {
        Row: {
          acs_url: string | null
          created_at: string
          created_by: string | null
          email_domains: string[]
          enabled: boolean
          id: string
          idp_entity_id: string | null
          metadata_url: string | null
          notes: string | null
          organization_id: string
          status: string
          updated_at: string
        }
        Insert: {
          acs_url?: string | null
          created_at?: string
          created_by?: string | null
          email_domains?: string[]
          enabled?: boolean
          id?: string
          idp_entity_id?: string | null
          metadata_url?: string | null
          notes?: string | null
          organization_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          acs_url?: string | null
          created_at?: string
          created_by?: string | null
          email_domains?: string[]
          enabled?: boolean
          id?: string
          idp_entity_id?: string | null
          metadata_url?: string | null
          notes?: string | null
          organization_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      organization_invites: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          organization_id: string
          role: Database["public"]["Enums"]["org_role"]
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          organization_id: string
          role?: Database["public"]["Enums"]["org_role"]
          token?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          organization_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_invites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["org_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          logo_url: string | null
          name: string
          plan: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          logo_url?: string | null
          name: string
          plan?: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          plan?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          locale: string | null
          marketing_opt_in: boolean
          onboarded_at: string | null
          phone: string | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          locale?: string | null
          marketing_opt_in?: boolean
          onboarded_at?: string | null
          phone?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          locale?: string | null
          marketing_opt_in?: boolean
          onboarded_at?: string | null
          phone?: string | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          last_used_at: string | null
          p256dh: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          last_used_at?: string | null
          p256dh: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          last_used_at?: string | null
          p256dh?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      seo_pages: {
        Row: {
          canonical_override: string | null
          created_at: string
          description: string | null
          json_ld: Json | null
          keywords: string | null
          noindex: boolean
          og_image_url: string | null
          path: string
          title: string | null
          updated_at: string
        }
        Insert: {
          canonical_override?: string | null
          created_at?: string
          description?: string | null
          json_ld?: Json | null
          keywords?: string | null
          noindex?: boolean
          og_image_url?: string | null
          path: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          canonical_override?: string | null
          created_at?: string
          description?: string | null
          json_ld?: Json | null
          keywords?: string | null
          noindex?: boolean
          og_image_url?: string | null
          path?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_seo: {
        Row: {
          background_color: string | null
          base_url: string | null
          brand_assets: Json
          default_description: string | null
          default_og_image_url: string | null
          default_title: string | null
          id: number
          organization_json_ld: Json
          site_name: string | null
          theme_color: string | null
          title_template: string | null
          twitter_handle: string | null
          updated_at: string
        }
        Insert: {
          background_color?: string | null
          base_url?: string | null
          brand_assets?: Json
          default_description?: string | null
          default_og_image_url?: string | null
          default_title?: string | null
          id?: number
          organization_json_ld?: Json
          site_name?: string | null
          theme_color?: string | null
          title_template?: string | null
          twitter_handle?: string | null
          updated_at?: string
        }
        Update: {
          background_color?: string | null
          base_url?: string | null
          brand_assets?: Json
          default_description?: string | null
          default_og_image_url?: string | null
          default_title?: string | null
          id?: number
          organization_json_ld?: Json
          site_name?: string | null
          theme_color?: string | null
          title_template?: string | null
          twitter_handle?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          company_legal_name: string | null
          contact_email: string | null
          from_email: string | null
          from_name: string | null
          id: number
          mailing_address: string | null
          reply_to: string | null
          social_facebook: string | null
          social_github: string | null
          social_instagram: string | null
          social_linkedin: string | null
          social_tiktok: string | null
          social_twitter: string | null
          social_youtube: string | null
          updated_at: string
        }
        Insert: {
          company_legal_name?: string | null
          contact_email?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: number
          mailing_address?: string | null
          reply_to?: string | null
          social_facebook?: string | null
          social_github?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_tiktok?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          updated_at?: string
        }
        Update: {
          company_legal_name?: string | null
          contact_email?: string | null
          from_email?: string | null
          from_name?: string | null
          id?: number
          mailing_address?: string | null
          reply_to?: string | null
          social_facebook?: string | null
          social_github?: string | null
          social_instagram?: string | null
          social_linkedin?: string | null
          social_tiktok?: string | null
          social_twitter?: string | null
          social_youtube?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      status_components: {
        Row: {
          created_at: string
          current_status: string
          description: string | null
          id: string
          name: string
          position: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_status?: string
          description?: string | null
          id?: string
          name: string
          position?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_status?: string
          description?: string | null
          id?: string
          name?: string
          position?: number
          updated_at?: string
        }
        Relationships: []
      }
      status_incidents: {
        Row: {
          body_md: string | null
          created_at: string
          id: string
          resolved_at: string | null
          severity: string
          started_at: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          body_md?: string | null
          created_at?: string
          id?: string
          resolved_at?: string | null
          severity?: string
          started_at?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          body_md?: string | null
          created_at?: string
          id?: string
          resolved_at?: string | null
          severity?: string
          started_at?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          environment: string
          id: string
          metadata: Json
          organization_id: string | null
          price_id: string | null
          product_id: string | null
          product_name: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          trial_end: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          metadata?: Json
          organization_id?: string | null
          price_id?: string | null
          product_id?: string | null
          product_name?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          metadata?: Json
          organization_id?: string | null
          price_id?: string | null
          product_id?: string | null
          product_name?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      support_chat_usage: {
        Row: {
          day: string
          ip_hash: string
          last_message_at: string
          message_count: number
        }
        Insert: {
          day?: string
          ip_hash: string
          last_message_at?: string
          message_count?: number
        }
        Update: {
          day?: string
          ip_hash?: string
          last_message_at?: string
          message_count?: number
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_organization_invite: { Args: { _token: string }; Returns: string }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      has_active_subscription: {
        Args: { check_env?: string; user_uuid: string }
        Returns: boolean
      }
      has_org_role: {
        Args: {
          _org_id: string
          _role: Database["public"]["Enums"]["org_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_org_member: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      list_confirmed_subscriber_emails: {
        Args: never
        Returns: {
          email: string
          id: string
          name: string
        }[]
      }
      log_audit: {
        Args: {
          _action: string
          _actor_user_id?: string
          _metadata?: Json
          _organization_id?: string
          _target_id?: string
          _target_type?: string
        }
        Returns: string
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      about_section_kind: "value" | "stat" | "milestone" | "press"
      app_role: "admin" | "moderator" | "user"
      campaign_status: "draft" | "scheduled" | "sending" | "sent" | "failed"
      lead_kind: "contact" | "demo" | "waitlist" | "newsletter" | "other"
      lead_status: "new" | "contacted" | "qualified" | "converted" | "archived"
      notification_channel: "email" | "sms" | "push" | "in_app"
      org_role: "owner" | "admin" | "member"
      subscriber_status:
        | "subscribed"
        | "unsubscribed"
        | "pending"
        | "bounced"
        | "complained"
      subscription_status:
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "incomplete"
        | "incomplete_expired"
        | "unpaid"
        | "paused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      about_section_kind: ["value", "stat", "milestone", "press"],
      app_role: ["admin", "moderator", "user"],
      campaign_status: ["draft", "scheduled", "sending", "sent", "failed"],
      lead_kind: ["contact", "demo", "waitlist", "newsletter", "other"],
      lead_status: ["new", "contacted", "qualified", "converted", "archived"],
      notification_channel: ["email", "sms", "push", "in_app"],
      org_role: ["owner", "admin", "member"],
      subscriber_status: [
        "subscribed",
        "unsubscribed",
        "pending",
        "bounced",
        "complained",
      ],
      subscription_status: [
        "trialing",
        "active",
        "past_due",
        "canceled",
        "incomplete",
        "incomplete_expired",
        "unpaid",
        "paused",
      ],
    },
  },
} as const
