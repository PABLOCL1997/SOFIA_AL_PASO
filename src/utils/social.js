export const facebookLogin = (callback) => {
  window.FB.login(
    (response) => {
      if (response.status === "connected") {
        window.FB.api(
          "/me?fields=id,name,email",
          (response) => {
            let name = response.name.split(" ").reverse();
            callback({
              email: response.email,
              firstname: name.pop(),
              lastname: name.join(" "),
              password: response.id,
            });
          },
          { scope: "email,public_profile,user_friends" }
        );
      } else {
        callback({});
      }
    },
    { scope: "email,public_profile" }
  );
};

export const googleLogin = (callback) => {
  try {
    window.gapi.load("auth2", () => {
      let auth2 = window.gapi.auth2.init({
        client_id: "477197213348-fjk4p43702gn9t61jja26iqsj6j7j2of.apps.googleusercontent.com", // secret: otnNeVFSXeVTn3_P7TptCk_E
        cookiepolicy: "single_host_origin",
      });
      auth2.attachClickHandler(
        document.querySelector(".googleBtn"),
        {},
        (googleUser) => {
          callback({
            email: googleUser.getBasicProfile().getEmail(),
            firstname: googleUser.getBasicProfile().getGivenName(),
            lastname: googleUser.getBasicProfile().getFamilyName(),
            password: googleUser.getBasicProfile().getId(),
          });
        },
        () => callback({})
      );
    });
  } catch (e) {}
};
