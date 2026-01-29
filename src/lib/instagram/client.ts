// Instagram Business Graph API Client

import axios, { AxiosInstance } from 'axios'
import type { InstagramUser } from '@/types/instagram'

const GRAPH_API_VERSION = 'v21.0'
const INSTAGRAM_GRAPH_API = `https://graph.instagram.com/${GRAPH_API_VERSION}`

export class InstagramClient {
  private accessToken: string
  private axiosInstance: AxiosInstance

  constructor(accessToken: string) {
    this.accessToken = accessToken
    this.axiosInstance = axios.create({
      baseURL: INSTAGRAM_GRAPH_API,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Get Instagram Business user information
   */
  async getUserInfo(): Promise<InstagramUser> {
    try {
      const response = await this.axiosInstance.get('/me', {
        params: {
          fields: 'id,username,account_type,name,profile_picture_url',
          access_token: this.accessToken,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('getUserInfo error:', error.response?.data || error.message)
      throw new Error(`Failed to get user info: ${error.response?.data?.error?.message || error.message}`)
    }
  }

  /**
   * Send a direct message via Instagram Business API
   * Uses the Instagram Graph API messaging endpoint
   * @param instagramUserId - Your Instagram Business Account ID (the one you're sending FROM)
   * @param recipientId - The Instagram-scoped ID (IGSID) of the recipient
   * @param message - The message text to send
   */
  async sendMessage(instagramUserId: string, recipientId: string, message: string): Promise<any> {
    try {
      // Instagram Business API uses /me/messages endpoint
      const response = await this.axiosInstance.post(
        `/${instagramUserId}/messages`,
        {
          recipient: { id: recipientId },
          message: { text: message },
        },
        {
          params: {
            access_token: this.accessToken,
          },
        }
      )
      return response.data
    } catch (error: any) {
      console.error('sendMessage error:', error.response?.data || error.message)
      throw new Error(`Failed to send message: ${error.response?.data?.error?.message || error.message}`)
    }
  }

  /**
   * Get conversations for the Instagram Business account
   */
  async getConversations(instagramUserId: string): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`/${instagramUserId}/conversations`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,participants,messages{id,message,from,to,created_time}',
        },
      })
      return response.data
    } catch (error: any) {
      console.error('getConversations error:', error.response?.data || error.message)
      throw new Error(`Failed to get conversations: ${error.response?.data?.error?.message || error.message}`)
    }
  }

  /**
   * Get messages from a specific conversation
   */
  async getConversationMessages(conversationId: string): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`/${conversationId}/messages`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,message,from,to,created_time',
        },
      })
      return response.data
    } catch (error: any) {
      console.error('getConversationMessages error:', error.response?.data || error.message)
      throw new Error(`Failed to get conversation messages: ${error.response?.data?.error?.message || error.message}`)
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
   * Exchange short-lived token for long-lived token (60 days)
   */
  async exchangeToken(shortLivedToken: string, appSecret: string): Promise<string> {
    try {
      const response = await axios.get(`https://graph.instagram.com/access_token`, {
        params: {
          grant_type: 'ig_exchange_token',
          client_secret: appSecret,
          access_token: shortLivedToken,
        },
      })
      return response.data.access_token
    } catch (error: any) {
      console.error('exchangeToken error:', error.response?.data || error.message)
      throw new Error(`Failed to exchange token: ${error.response?.data?.error?.message || error.message}`)
    }
  }

  /**
   * Refresh a long-lived token (must be done before it expires)
   */
  async refreshToken(): Promise<{ access_token: string; expires_in: number }> {
    try {
      const response = await axios.get(`https://graph.instagram.com/refresh_access_token`, {
        params: {
          grant_type: 'ig_refresh_token',
          access_token: this.accessToken,
        },
      })
      return response.data
    } catch (error: any) {
      console.error('refreshToken error:', error.response?.data || error.message)
      throw new Error(`Failed to refresh token: ${error.response?.data?.error?.message || error.message}`)
    }
  }
}

