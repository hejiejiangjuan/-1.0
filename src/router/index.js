import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Home from '@/pages/Home'
import ArticleLists from '@/pages/ArticleLists'
import Allorder from '@/components/Allorder'
import Message from '@/components/Message'
import Noverify from '@/components/Noverify'
import Order from '@/components/Order'
import Right from '@/components/Right'
import Sedno from '@/components/Sedno'
import Sedyes from '@/components/Sedyes'
import Toorder from '@/components/Toorder'
import Usernam from '@/components/Usernam'
import Verify from '@/components/Verify'
import Yesverify from '@/components/Yesverify'
import Hotel from '@/components/hotel/Hotel'
import Hotellist from '@/components/hotel/Hotellist'
import HotelOrderList from '@/components/HotelOrderList'
import Merchent from '@/components/merchent/Merchent'
import Merchentlist from '@/components/merchent/Merchentlist'
import Ditch from '@/components/ditch/Ditch'
import Ditchlist from '@/components/ditch/Ditchlist'
import Grogshop from '@/components/grogshop/Grogshop'
import Grogshoplist from '@/components/grogshop/Grogshoplist'
import HotelMessage from '@/components/appointment/HotelMessage'
import Gohotel from '@/components/hotel/Gohotel'
import HotelMsgOk from '@/components/appointment/HotelMsgOk'
import AlreadyUsed from '@/components/appointment/AlreadyUsed'
import HotelMsgFail from '@/components/appointment/HotelMsgFail'
import Ticketshop from '@/components/ticket/Ticketshop'
import TicketshopList from '@/components/ticket/TicketshopList'
import Hotelnumber from '@/pages/Hotelnumber'
import Jurisdicion from '@/components/jurisdicion/Jurisdiction'
import Adduser from '@/components/adduser/adduser'
import AdduserList from '@/components/adduser/adduserList'
import AddRoomType from '@/components/grogshop/addRoomType'
import ThirdSystem from '@/components/adduser/thirdSystem'


Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [{
      path: '/',
      component: Login
    }, {
      path: '/home',
      component: Home,
      children: [{
        path: '',
        component: ArticleLists
      }, {
        path: 'articleLists',
        component: ArticleLists
      }, {
        path: 'allorder',
        component: Allorder
      }, {
        path: 'message',
        component: Message
      }, {
        path: 'noverify',
        component: Noverify
      }, {
        path: 'order',
        component: Order
      }, {
        path: 'right',
        component: Right
      }, {
        path: 'sedno',
        component: Sedno
      }, {
        path: 'sedyes',
        component: Sedyes
      }, {
        path: 'toorder',
        component: Toorder
      }, {
        path: 'Usernam',
        component: Usernam
      }, {
        path: 'Verify',
        component: Verify
      }, {
        path: 'Yesverify',
        component: Yesverify
      }, {
        path: 'hotel',
        component: Hotel
      }, {
        path: 'hotellist',
        component: Hotellist
      }, {
        path: 'merchent',
        component: Merchent
      }, {
        path: 'merchentlist',
        component: Merchentlist
      }, {
        path: 'ditch',
        component: Ditch
      }, {
        path: 'ditchlist',
        component: Ditchlist
      }, {
        path: 'grogshop',
        component: Grogshop
      }, {
        path: 'grogshoplist',
        component: Grogshoplist
      },{
        path:'hotelMessage',
        component:HotelMessage
      },{
        path:'gohotel',
        component:Gohotel
      },{
        path:'hotelMsgOk',
        component:HotelMsgOk
      },
      {
        path:'alreadyUsed',
        component:AlreadyUsed
      },
      {
        path:'hotelMsgFail',
        component:HotelMsgFail
      },
      {
        path:'ticketshop',
        component:Ticketshop
      },
      {
        path:'ticketshopList',
        component:TicketshopList
      },
      {
        path:'hotelOrderList',
        component:HotelOrderList
      },
      {
        path:'hotelnumber',
        component:Hotelnumber
      },
      {
        path:'Jurisdiction',
        component:Jurisdicion
      },
      {
        path:'adduser',
        component:Adduser
      },
      {
        path:'adduserList',
        component:AdduserList
      },
      {
        path:'addRoomType',
        component:AddRoomType
      },
      {
        path:'thirdSystem',
        component:ThirdSystem
      }
    ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
