export default {
  items: [

    {
      name: 'Home',
      url: '/',
      icon: 'icon-home',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    {
      title: true,
      name: 'Management',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'User List',
      url: '/user-list',
      icon: 'icon-user'
    },
    
    // {
    //   name: 'Request Form',
    //   url: '/requestForm',
    //   icon: 'icon-speedometer',
    //   badge: {
    //     variant: 'info',
    //     text: 'own page',
    //   },
    // },
    {
      name: 'Request List',
      url: '/reqList',
      icon: 'icon-home'
    },
    {
      name: 'Pending Account Request',
      url: '/pending-account',
      icon: 'icon-check'
    },
    {
      name: 'Detail Request',
      url: '/detailRequest',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'own page',
      },

    },
    {
      divider: true,
    },
    {
      title: true,
      name: 'Extras',
    },
    {
      name: 'Pages',
      url: '/pages',
      icon: 'icon-star',
      children: [
        {
          name: 'Login',
          url: '/login',
          icon: 'icon-star',
        },
        {
          name: 'Register',
          url: '/register',
          icon: 'icon-star',
        },
        {
          name: 'Error 404',
          url: '/404',
          icon: 'icon-star',
        },
        {
          name: 'Error 500',
          url: '/500',
          icon: 'icon-star',
        },
      ],
    }
  ],
};
