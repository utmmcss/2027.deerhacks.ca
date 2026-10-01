import { APITemplate } from '@/api/types'
import { CustomFetch } from '@/api/useFetch'
import {
  AdminEventDeleteResp,
  AdminEventListResp,
  AdminEventResp,
  EventCreateReq,
  EventUpdateReq,
  SettingsResp,
  SettingUpdateReq,
  SettingUpdateResp,
} from '@/types/Admin'
import {
  ApplicationGetResp,
  ApplicationUpdateReq,
  ResumeGetResp,
  ResumeUpdateResp,
} from '@/types/Application'
import { EmailSendReq, EmailSendResp, EmailVerifyReq, EmailVerifyResp } from '@/types/Email'
import { EventListResp, eventListStatic } from '@/types/Event'
import { PhotoListResp, photoListStatic } from '@/types/Photo'
import { QRCheckInReq, QRCheckInResp, QRUserGetParams } from '@/types/QRCode'
import {
  UserGetResp,
  UserListIdsParams,
  UserListIdsResp,
  UserListParams,
  UserListResp,
  UserLoginReq,
  UserUpdateBatchReq,
  UserUpdateReq,
} from '@/types/User'
import {
  EventRedemptionsResp,
  PointAdjustReq,
  PointAdjustResp,
  QRTokenResp,
  UserPointsResp,
  WorkshopClaimReq,
  WorkshopClaimResp,
} from '@/types/Workshop'

export const config = (customFetch: CustomFetch) =>
  ({
    ...application(customFetch),
    ...publicSettings(customFetch),
    ...admin(customFetch),
    ...email(customFetch),
    ...events(customFetch),
    ...photos(customFetch),
    ...qrCodes(customFetch),
    ...users(customFetch),
    ...workshop(customFetch),
    ..._(),
  } as const satisfies APITemplate)

const application = (customFetch: CustomFetch) =>
  ({
    applicationGet: async () => {
      const res = await customFetch('GET', 'DH_BE', '/application-get')
      return res.data as ApplicationGetResp
    },
    applicationUpdate: async (args: ApplicationUpdateReq) => {
      const res = await customFetch('POST', 'DH_BE', '/application-update', args)
      return res.data as {}
    },
    resumeGet: async () => {
      const res = await customFetch('GET', 'DH_BE', '/resume-get')
      return res.data as ResumeGetResp
    },
    resumeUpdate: async (args: FormData) => {
      const res = await customFetch('POST', 'DH_BE', '/resume-update', args, {
        isForm: true,
      })
      return res.data as ResumeUpdateResp
    },
  } as const)

const publicSettings = (customFetch: CustomFetch) =>
  ({
    settingsGet: async () => {
      const res = await customFetch('GET', 'DH_BE', '/settings')
      return res.data as SettingsResp
    },
  } as const)

const admin = (customFetch: CustomFetch) =>
  ({
    adminEventList: async () => {
      const res = await customFetch('GET', 'DH_BE', '/admin/events')
      return res.data as AdminEventListResp
    },
    adminEventCreate: async (args: EventCreateReq) => {
      const res = await customFetch('POST', 'DH_BE', '/admin/events', args)
      return res.data as AdminEventResp
    },
    adminEventUpdate: async (args: { id: number; data: EventUpdateReq }) => {
      const res = await customFetch('PUT', 'DH_BE', `/admin/events/${args.id}`, args.data)
      return res.data as AdminEventResp
    },
    adminEventDelete: async (args: { id: number }) => {
      const res = await customFetch('DELETE', 'DH_BE', `/admin/events/${args.id}`)
      return res.data as AdminEventDeleteResp
    },
    adminSettingsGet: async () => {
      const res = await customFetch('GET', 'DH_BE', '/admin/settings')
      return res.data as SettingsResp
    },
    adminSettingsUpdate: async (args: { key: string; data: SettingUpdateReq }) => {
      const res = await customFetch('PUT', 'DH_BE', `/admin/settings/${args.key}`, args.data)
      return res.data as SettingUpdateResp
    },
  } as const)

const email = (customFetch: CustomFetch) =>
  ({
    emailVerify: async (args: EmailVerifyReq) => {
      const res = await customFetch('POST', 'DH_BE', '/email-verify', args)
      return res.data as EmailVerifyResp
    },
    emailSend: async (args: EmailSendReq) => {
      const res = await customFetch('POST', 'DH_BE', '/admin-email-send', args)
      return res.data as EmailSendResp
    },
  } as const)

const events = (customFetch: CustomFetch) =>
  ({
    eventList: async () => {
      const res = await customFetch(
        'GET',
        'DH_BE',
        '/events?pagination[page]=1&pagination[pageSize]=100&sort[0]=StartTime&sort[1]=Important:desc&sort[2]=EndTime:desc&sort[3]=Title'
      )
      return res.data as EventListResp
    },
  } as const)

const photos = (customFetch: CustomFetch) =>
  ({
    photoList: async () => {
      const res = await customFetch(
        'GET',
        'DH_CMS',
        '/photos?pagination[page]=1&pagination[pageSize]=100&populate[0]=Img&sort[0]=publishedAt:desc'
      )
      return res.data as PhotoListResp
    },
  } as const)

const qrCodes = (customFetch: CustomFetch) =>
  ({
    qrCheckIn: async (args: QRCheckInReq) => {
      const res = await customFetch('POST', 'DH_BE', '/qr-check-in', args)
      return res.data as QRCheckInResp
    },
    qrUserInfo: async (args: QRUserGetParams) => {
      const res = await customFetch('GET', 'DH_BE', `/admin-user-get?qrId=${args.qrId}`)
      return res.data as UserGetResp
    },
  } as const)

const users = (customFetch: CustomFetch) =>
  ({
    userGet: async () => {
      const res = await customFetch('GET', 'DH_BE', '/user-get')
      return res.data as UserGetResp
    },
    userList: async (params: UserListParams) => {
      const { full, page, statuses, internal_statuses, search } = params
      const res = await customFetch(
        'GET',
        'DH_BE',
        `/user-list?full=${full}&page=${page}&statuses=${statuses?.join(
          ','
        )}&internal_statuses=${internal_statuses?.join(',')}&search=${encodeURIComponent(search)}`
      )
      return res.data as UserListResp
    },
    userUpdate: async (args: UserUpdateReq) => {
      const res = await customFetch('POST', 'DH_BE', '/user-update', args)
      return res.data as {}
    },
    userUpdateBatch: async (args: UserUpdateBatchReq) => {
      const res = await customFetch('POST', 'DH_BE', '/admin-user-update', args)
      return res.data as {}
    },
    userLogin: async (args: UserLoginReq) => {
      const res = await customFetch('POST', 'DH_BE', '/user-login', args)
      return res.data as {}
    },
    userLogout: async () => {
      const res = await customFetch('POST', 'DH_BE', '/user-logout')
      return res.data as {}
    },
    userListIds: async (params: UserListIdsParams) => {
      const { statuses, internal_statuses, search } = params
      const res = await customFetch(
        'GET',
        'DH_BE',
        `/user-list-ids?statuses=${statuses?.join(',')}&internal_statuses=${internal_statuses?.join(',')}&search=${encodeURIComponent(search)}`
      )
      return res.data as UserListIdsResp
    },
  } as const)

const workshop = (customFetch: CustomFetch) =>
  ({
    workshopClaim: async (args: WorkshopClaimReq) => {
      const res = await customFetch('POST', 'DH_BE', '/workshop-claim', args)
      return res.data as WorkshopClaimResp
    },
    userPointsGet: async (args?: { discord_id?: string }) => {
      const params = args?.discord_id ? `?discord_id=${args.discord_id}` : ''
      const res = await customFetch('GET', 'DH_BE', `/user-points${params}`)
      return res.data as UserPointsResp
    },
    adminQRTokenGet: async (args: { id: number }) => {
      const res = await customFetch('GET', 'DH_BE', `/admin/events/${args.id}/qr-token`)
      return res.data as QRTokenResp
    },
    adminEventRedemptionsList: async (args: { id: number }) => {
      const res = await customFetch('GET', 'DH_BE', `/admin/events/${args.id}/redemptions`)
      return res.data as EventRedemptionsResp
    },
    adminPointsAdjust: async (args: PointAdjustReq) => {
      const res = await customFetch('POST', 'DH_BE', '/admin/user-points-adjust', args)
      return res.data as PointAdjustResp
    },
  } as const)

// Mock Data Response for Development
const _ = () =>
  ({
    mockUserGet: async () => {
      function getUserWithTimeout(): Promise<UserGetResp> {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              user: {
                discord_id: '637134163354320896',
                first_name: 'Anthony',
                last_name: 'Tedja',
                username: 'tedja',
                email: 'user@deerhacks.ca',
                status: 'admin',
                avatar: '1f4f0ffa2b50d6c853379d0ef53d245a',
                qr_code: '0123456789',
              },
            })
          }, 200)
        })
      }

      return await getUserWithTimeout()
    },
    mockUserLogin: async (_: UserLoginReq) => {
      console.log(_)
      function getLoginWithTimeout(): Promise<{}> {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({})
          }, 200)
        })
      }

      return await getLoginWithTimeout()
    },
    mockEmailVerify: async (_: EmailVerifyReq) => {
      console.log(_)
      function emailVerifyWithTimeout(): Promise<EmailVerifyResp> {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              status: 'invalid',
              context: 'invalid',
            })
          }, 200)
        })
      }

      return await emailVerifyWithTimeout()
    },
    mockEventList: async () => {
      function getEventList(): Promise<EventListResp> {
        return Promise.resolve(eventListStatic)
      }

      return await getEventList()
    },
    mockPhotoList: async () => {
      function getPhotoList(): Promise<PhotoListResp> {
        return Promise.resolve(photoListStatic)
      }

      return await getPhotoList()
    },
  } as const)
