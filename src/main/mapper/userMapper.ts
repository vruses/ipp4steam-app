import type { UserInfo, LoginRes, User } from '@preload/types/user'
import prisma from '@main/mapper/prisma'

// 查询所有用户信息
const queryAllUserInfo = async (): Promise<UserInfo[]> => {
  const userList = await prisma.user.findMany({
    select: {
      steamID: true,
      nickname: true,
      loginStatus: true,
      proxies: {
        select: {
          proxy: {
            select: {
              configName: true
            }
          }
        }
      }
    }
  })

  // 对象转换
  const userInfoList = userList.map((user) => {
    const { proxies, ...rest } = user
    return {
      ...rest,
      proxynameList: proxies.map((item) => {
        return item.proxy.configName
      })
    }
  })
  return userInfoList
}

// 新增用户数据,或更新用户登录状态，返回该用户
const updateUserStatus = async (res: LoginRes, cookie: string): Promise<User> => {
  const user = await prisma.user.upsert({
    where: { steamID: res.steamID },
    update: {
      loginStatus: res.loginStatus
    },
    create: {
      steamID: res.steamID,
      nickname: res.nickname,
      loginStatus: res.loginStatus,
      cookie: cookie
    },
    select: {
      steamID: true,
      nickname: true,
      loginStatus: true
    }
  })
  return user
}

// 查询所有cookie
const queryAllCookies = async (): Promise<string[]> => {
  const results = await prisma.user.findMany({
    select: {
      cookie: true
    }
  })
  const cookieList = results.map((result) => result.cookie)
  return cookieList
}

// 更新现有的所有用户状态，返回status为failed的user列表
const updateAllUserStatus = async (resList: User[]): Promise<User[]> => {
  const user = resList.map((user) =>
    prisma.user.update({
      where: { steamID: user.steamID },
      data: {
        loginStatus: user.loginStatus
      },
      select: {
        steamID: true,
        nickname: true,
        loginStatus: true
      }
    })
  )
  // 原子性执行所有更新
  const failedUserList = (await prisma.$transaction(user)).filter(
    (item) => item.loginStatus === 'failed'
  )
  return failedUserList
}

// 更新用户订阅,返回当前用户订阅列表
const updateUserSubs = async (steamID: bigint): Promise<string[]> => {
  const user = await prisma.user.findUnique({
    where: { steamID },
    select: { id: true }
  })
  const res = await prisma.userProxy.findMany({
    where: { userId: user?.id },
    select: {
      proxy: {
        select: {
          configName: true
        }
      }
    }
  })
  const subList = res.map((item) => {
    return item.proxy.configName
  })
  return subList
}

// 删除用户
const deleteUser = async (steamID: bigint): Promise<string> => {
  const user = await prisma.user.delete({
    where: {
      steamID
    },
    select: {
      nickname: true
    }
  })
  return user.nickname
}

export {
  queryAllUserInfo,
  updateUserStatus,
  queryAllCookies,
  updateAllUserStatus,
  updateUserSubs,
  deleteUser
}
