Hello World!


This is my first website I made. I started compiling these site from 2 November 2023 as a hobby , from bare minimum site to now something different and unique. Time flies like flash. Its kind of fun compiling these site , but as usual more features = more bugs. I had to gone through fixing a ton lot of stuffs in order to add features and still I am fixing stuffs for these site in order to add new features to the site as I kind of love compiling site. I always believe in " Life without happiness is like useless to live. So, try to enjoy your life. "

Talking about the website , its a site where 17 players info's are available , in this site you can compare against other players available in this site. This site features unique designs which are not so much common in other websites; also it features login and signup through verified email and pass , google by the help of firebase ; for logged in users this site features no ads for them , ability to vote for the players among the listed 17 players in this site and able to play a football game but for non logged in users this site features ads for them. Users can verify the email, delete, create their account, change the password, submit and update vote thanks to firebase. It also features user info for the logged in user and features live chart voting result. This site uses bootstrap, jquery, fontawesome, firebase, google fonts, javascript, css, chart js, wikipedia api, cloudflare turnstile, google search console, cloudflare pages.

As a newbie in web development, I am still trying my level best in order to add new features to the site. I hope you guys are enjoying it.

Site link - https://football-players-info.pages.dev/ (shifted from github pages to cloudflare pages as I was unable to deploy site in github pages for unknown reasons.)


## Known performance characteristics

**Stack:** Firebase Auth + Firestore, Bootstrap 5 (self-hosted), 
FontAwesome CDN, Chart.js, jQuery, 17 background videos.

**Expected Lighthouse Performance:** 63-88 average on "Slow 4G" emulation.

**Why scores vary between runs (63-88):**
Firestore's first auth-state listener takes 2-4 seconds to resolve on 
Slow 4G emulation. This happens before `DOMContentLoaded` fires, which 
means the splash screen stays visible — and Lighthouse measures LCP as 
"when the largest element becomes visible," so it registers as slow.

The variance is not a code regression. It's Firebase's inherent behavior 
on artificially slow networks. Real users on WiFi/4G/5G see ~1.5-2.5s 
LCP, equivalent to Lighthouse 85-95.

**What's optimized:**
- All 17 background videos re-encoded (7 MB → 3.62 MB total)
- Bootstrap CSS/JS self-hosted (eliminated ~1.2s CDN latency)
- 5 targeted preconnects (fonts, Firebase auth, Firestore)
- CLS = 0.001 (essentially perfect)
- TBT = 0-30ms (essentially perfect)
- Turnstile bot protection verified server-side via /api/verify-turnstile

**What can't be optimized without a full rewrite:**
- Firebase's initial connection latency (would require replacing Firebase)
- Bootstrap unused CSS (~44 KB — inherent to Bootstrap)
- Firebase unused JS (~315 KB — inherent to Firebase SDK)
- Google Fonts CDN latency (~750ms — could self-host, but fragile)
