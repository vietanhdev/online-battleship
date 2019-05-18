export default function() {
  return [
    {
      title: "Games",
      to: "/games",
      htmlBefore: '<i class="material-icons">videogame_asset</i>',
      htmlAfter: ""
    },
    {
      title: "Messages",
      to: "/messages",
      htmlBefore: '<i class="material-icons">mail_outline</i>',
      htmlAfter: ""
    },
    {
      title: "User Profile",
      htmlBefore: '<i class="material-icons">person</i>',
      to: "/user-profile",
    },
    {
      title: "Forms & Components",
      htmlBefore: '<i class="material-icons">mail_outline</i>',
      to: "/components-overview",
    },
    {
      title: "Tables",
      htmlBefore: '<i class="material-icons">table_chart</i>',
      to: "/tables",
    },
    {
      title: "Errors",
      htmlBefore: '<i class="material-icons">error</i>',
      to: "/errors",
    }
  ];
}
