const homeHandleRouter = require('./handleRouter/HomeHandleRouter');
const memberHandleRouter = require('./handleRouter/memberHandleRouter');
const router = {
    'home' : homeHandleRouter.showHome,
    'myPosts': homeHandleRouter.showMyPosts,
    'myProfile': memberHandleRouter.showMyProfile,
    'add': homeHandleRouter.addPost,
    'delete': homeHandleRouter.deletePost,
    'edit': homeHandleRouter.editPost,
    'login': memberHandleRouter.login
}
module.exports = router