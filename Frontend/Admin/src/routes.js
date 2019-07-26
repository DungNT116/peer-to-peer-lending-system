import Index from "views/Index.jsx";
import Profile from "views/examples/Profile.jsx";
import Maps from "views/examples/Maps.jsx";
import Register from "views/examples/Register.jsx";
import Login from "views/examples/Login.jsx";
import Tables from "views/examples/Tables.jsx";
import Icons from "views/examples/Icons.jsx";
import UserList from "views/UserList.jsx";
import PendingDocuments from "views/PendingDocuments.jsx";
import DocumentDetail from "views/DocumentDetail.jsx";

var routes = [
  {
    path: "/userList",
    name: "User List",
    icon: "ni ni-circle-08 text-primary",
    component: UserList,
    layout: "/admin"
  },

  {
    path: "/pending-document",
    name: "Pending Documents",
    icon: "ni ni-folder-17 text-warning",
    component: PendingDocuments,
    layout: "/admin"
  },
  // {
  //   path: "/index",
  //   name: "Dashboard",
  //   icon: "ni ni-tv-2 text-primary",
  //   component: Index,
  //   layout: "/admin"
  // },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: Icons,
    layout: "/admin"
  },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: Maps,
  //   layout: "/admin"
  // },
  {
    path: "/document-detail",
    name: "Document Detail",
    icon: "ni ni-single-02 text-yellow",
    component: DocumentDetail,
    layout: "/admin"
  },
  // {
  //   path: "/user-profile",
  //   name: "User Profile",
  //   icon: "ni ni-single-02 text-yellow",
  //   component: Profile,
  //   layout: "/admin"
  // },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/admin"
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  }
  // {
  //   path: "/register",
  //   name: "Register",
  //   icon: "ni ni-circle-08 text-pink",
  //   component: Register,
  //   layout: "/auth"
  // }
];
export default routes;
