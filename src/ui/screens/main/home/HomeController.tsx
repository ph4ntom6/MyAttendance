import React, { FC } from 'react'
import { HomeBottomBarRoutes } from 'routes/HomeBottomBarRoutes'

const HomeBaseController: FC = ({}) => {
    return <HomeBottomBarRoutes initialParams={'PunchInAndOut'} />
}

export default HomeBaseController
