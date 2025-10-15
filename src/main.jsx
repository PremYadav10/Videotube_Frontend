import { React, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from "./Pages/Home"
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import PublishVideo from './Pages/Video/PublishVideo.jsx'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './App/store.js'
import Video from './Pages/Video/Video.jsx'
import TweetPage from './Pages/Tweet/TweetPage.jsx'
import Logout from './Pages/Logout.jsx'
import Playlist from './Pages/Playlist/Playlist.jsx'
import Settings from './Pages/Settings/settings.jsx'
import UpdateAccountDetails from './Pages/Settings/UpdateAccountDetails.jsx'
import ChangePasswordForm from './Pages/Settings/ChangePassword.jsx'
import UpdateProfilePictureForm from './Pages/Settings/UpdateAvatar.jsx'
import UpdateCoverImageForm from './Pages/Settings/UpdateCoverImage.jsx'
import ProfilePage from './Pages/Profile.jsx'
import HistoryPage from './Pages/History.jsx'
import PlaylistsPage from './Pages/ProfilePlaylist.jsx'
import LikedVideosPage from './Pages/LikedVideos.jsx'
import WatchLaterPage from './Pages/WatchLater.jsx'
import ChannelDashboard from './Pages/ChannelDashboard.jsx'
import ChannelStatsPage from './Pages/ChannelStatePage.jsx'
import ChannelVideosPage from './Pages/ChannelVideoPage.jsx'
import ChannelSubscribersPage from './Pages/ChannelSubscriber.jsx'
import ChannelSubscribedPage from './Pages/SbuscribedChannel.jsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/login",
                element: (
                    <Login />
                ),
            },
            {
                path: "/signup",
                element: (
                    <Signup />
                ),
            },
            {
                path: "/publish-video",
                element: (
                    <PublishVideo />
                ),
            },
            {
                path: "/tweets",
                element: <TweetPage />
            },
            {
                path: "/logout",
                element: <Logout />
            },
            {
                path: "/playlist/:playlistId",
                element: <Playlist />
            },
            {
                path: "/settings",
                element: <Settings />,
                children: [
                    {
                        path: "update-account-details",
                        element: <UpdateAccountDetails />
                    },
                    {
                        path: "change-password",
                        element: <ChangePasswordForm />
                    },
                    {
                        path: "profile-picture",
                        element: <UpdateProfilePictureForm />
                    }, {
                        // NEW: Route for the cover image upload
                        path: "cover-image",
                        element: <UpdateCoverImageForm />
                    },
                ]
            },
            {
                path: "/profile",
                element: <ProfilePage />,
                children: [
                    {
                        // The default/index route for /profile should redirect to history
                        index: true,
                        element: <HistoryPage />, // This is needed to satisfy the redirect logic
                    },
                    {
                        // Full path: /profile/history. This will handle the API call for history.
                        path: "history",
                        element: <HistoryPage />
                    },
                    {
                        // Full path: /profile/playlists. This will handle the API call for playlists.
                        path: "playlists",
                        element: <PlaylistsPage />
                    },
                    {
                        path: "liked",
                        element: <LikedVideosPage />
                    },
                    {
                        path: "watch-later",
                        element: <WatchLaterPage />
                    },
                    {
                        path: "subscriptions", // Access URL: /profile/subscriptions
                        element: <ChannelSubscribedPage />
                    },
                ]
            }
        ],
    },
    {
        path: "/video/:videoId",
        element: <Video />
    },// In your main router setup file (e.g., AppRoutes.jsx)
    // Assuming the base path is /dashboard

    {
        path: "/dashboard",
        element: <ChannelDashboard />, // Main component with header and tabs
        children: [
            {
                // Default/index route: /dashboard or /dashboard/stats
                path: "stats",
                element: <ChannelStatsPage />
            },
            {
                // Content tab route: /dashboard/videos
                path: "videos",
                element: <ChannelVideosPage />
            },
            {
                // NEW: Route for the subscriber list
                path: "subscribers",
                element: <ChannelSubscribersPage />
            },
            // Optional: you can set index: true for 'stats' to handle the default redirect more cleanly
            // { index: true, element: <ChannelStatsPage /> }
        ]
    }

])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>
)
