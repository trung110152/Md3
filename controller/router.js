const homeHandleRouter = require('./handleRouter/HomeHandleRouter');
const memberHandleRouter = require('./handleRouter/memberHandleRouter');
const router = {
    'home' : homeHandleRouter.showHome,
    'myPosts': homeHandleRouter.showMyPosts,
    'myProfile': memberHandleRouter.showMyProfile,
    'add': homeHandleRouter.addPost,
    'addMember': memberHandleRouter.addMember,
    'delete': homeHandleRouter.deletePost,
    'deleteMember': memberHandleRouter.deleteMember,
    'edit': homeHandleRouter.editPost,
    'login': memberHandleRouter.login,
    'management': memberHandleRouter.showMember
}
module.exports = router