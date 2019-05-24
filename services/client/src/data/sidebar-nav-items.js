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
      title: "Info",
      htmlBefore: '<i class="material-icons">info</i>',
      to: "/",
    }
  ];
}
