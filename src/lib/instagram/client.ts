// Instagram Graph API Client

import axios, { AxiosInstance } from 'axios'
import type { InstagramUser, SendMessageRequest } from '@/types/instagram'

const INSTAGRAM_API_BASE = 'https://graph.instagram.com'
const FACEBOOK_API_BASE = 'https://graph.facebook.com/v18.0'

export class InstagramClient {
  private accessToken: string
  private axiosInstance: AxiosInstance

  constructor(accessToken: string) {
    this.accessToken = accessToken
    this.axiosInstance = axios.create({
      baseURL: INSTAGRAM_API_BASE,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Get Instagram user information
   */
  async getUserInfo(): Promise<InstagramUser> {
    try {
      const response = await this.axiosInstance.get('/me', {
        params: {
          fields: 'id,username,account_type',
          access_token: this.accessToken,
        },
      })
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to get user info: ${error.message}`)
    }
  }

  /**
   * Send a direct message via Instagram
   * Note: Instagram DMs are sent through Facebook Page messaging
   */
  async sendMessage(pageId: string, recipientId: string, message: string): Promise<any> {
    try {
      // Instagram DMs are sent through Facebook Page messaging API
      const response = await axios.post(
        `${FACEBOOK_API_BASE}/${pageId}/messages`,
        {
          recipient: { id: recipientId },
          message: { text: message },
          messaging_type: 'RESPONSE',
        },
        {
          params: {
            access_token: this.accessToken,
          },
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to send message: ${error.message}`)
    }
  }

  /**
   * Get conversation messages
   */
  async getConversation(conversationId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${FACEBOOK_API_BASE}/${conversationId}/messages`,
        {
          params: {
            access_token: this.accessToken,
            fields: 'id,message,from,to,created_time',
          },
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to get conversation: ${error.message}`)
    }
  }

  /**
   * Subscribe to webhooks for a page
   */
  async subscribeToWebhooks(pageId: string, webhookUrl: string, verifyToken: string): Promise<any> {
    try {
      const response = await axios.post(
        `${FACEBOOK_API_BASE}/${pageId}/subscribed_apps`,
        {
          subscribed_fields: 'messages,messaging_postbacks',
        },
        {
          params: {
            access_token: this.accessToken,
          },
        }
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Failed to subscribe to webhooks: ${error.message}`)
    }
  }

  /**
   * Verify access token is still valid
   */
  async verifyToken(): Promise<boolean> {
    try {
      await this.axiosInstance.get('/me', {
        params: {
          fields: 'id',
          access_token: this.accessToken,
        },
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * Exchange short-lived token for long-lived token
   */
  async exchangeToken(shortLivedToken: string, appSecret: string): Promise<string> {
    try {
      const response = await axios.get(`${FACEBOOK_API_BASE}/oauth/access_token`, {
        params: {
          grant_type: 'ig_exchange_token',
          client_secret: appSecret,
          access_token: shortLivedToken,
        },
      })
      return response.data.access_token
    } catch (error: any) {
      throw new Error(`Failed to exchange token: ${error.message}`)
    }
  }
}

