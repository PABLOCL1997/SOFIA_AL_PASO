import React from "react";
import Helmet from "react-helmet";

const GTM = () => {
  return (
    <Helmet>
      <script type="application/javascript" async defer src="https://apis.google.com/js/platform.js"></script>
      <meta name="google-signin-client_id" content="477197213348-fjk4p43702gn9t61jja26iqsj6j7j2of.apps.googleusercontent.com" />
      {/* <script type="application/javascript">
        {`
                window.fbAsyncInit = function () {
                    FB.init({
                    appId: "614067362874540",
                    cookie: true,
                    xfbml: true,
                    version: "v7.0"
                    });
                    FB.AppEvents.logPageView();
                };
                `}
      </script> */}
      <script type="application/javascript" async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"></script>
      <script type="application/javascript">
        {`
                (function (w, d, s, l, i) {
                    w[l] = w[l] || [];
                    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
                    var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s),
                    dl = l != "dataLayer" ? "&l=" + l : "";
                    j.async = true;
                    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
                    f.parentNode.insertBefore(j, f);
                })(window, document, "script", "dataLayer", "GTM-WTF75HG");
                `}
      </script>
      <script type="text/javascript" async>
        {`
                (function() {
                window.__insp = window.__insp || [];
                __insp.push(['wid', 145310927]);
                var ldinsp = function(){
                if(typeof window.__inspld != "undefined") return; window.__inspld = 1; var insp = document.createElement('script'); insp.type = 'text/javascript'; insp.async = true; insp.id = "inspsync"; insp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://cdn.inspectlet.com/inspectlet.js?wid=145310927&r=' + Math.floor(new Date().getTime()/3600000); var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(insp, x); };
                setTimeout(ldinsp, 0);
                })();
                `}
      </script>

      <script>
        {`
                (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:2020275,hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                `}
      </script>

      <script type="text/javascript" src="https://a.omappapi.com/app/js/api.min.js" data-account="96460" data-user="85930" async></script>
    </Helmet>
  );
};

export default GTM;
