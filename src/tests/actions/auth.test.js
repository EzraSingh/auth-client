import configureMockStore from 'redux-mock-store'
import MockAdapter from 'axios-mock-adapter'
import getAction from 'tests/utils/getAction'
import thunk from 'redux-thunk'
import api from 'api'
import { login, logout, deleteAccount } from 'actions/auth'

const mockApi = new MockAdapter(api)
const mockStore = configureMockStore([ thunk ])

describe('auth actions', () => {
    const store = mockStore()
    const user = { email: 'test@user.com', password: 'letmein' }
    beforeEach(() => {
        store.clearActions()
    })
    describe('login', () => {
        it('should handle auth and init an auth token', async () => {
            const token = 'mock-token'
            mockApi.onPost('/auth').reply(200, { token, message: 'TEST_SERVER_MSG' })
            store.dispatch(login(user))
            expect(await getAction(store, "LOGIN_ATTEMPT")).toEqual({ type: "LOGIN_ATTEMPT" })
            expect(await getAction(store, "LOGIN")).toEqual({ type: "LOGIN", token, email: user.email })
        })
        it('should deflect auth when server denies access', async () => {
            mockApi.onPost('/auth').reply(400, { message: 'TEST_ERR_MSG' })
            store.dispatch(login(user))
            expect(await getAction(store, "LOGIN_ATTEMPT")).toEqual({ type: "LOGIN_ATTEMPT" })
            expect(await getAction(store, "LOGIN_FAILURE")).toEqual({ type: "LOGIN_FAILURE" })
        })
    })
    describe('logout', () => {
        it('should dereference session and reset app state', () => {
            const expectedActions = [ { type: "LOGOUT" }, { type: "RESET_APP" } ]
            store.dispatch(logout())
            expect(store.getActions()).toEqual(expectedActions)
        })
    })
    describe('deleteAccount', () => {
        const password = 'mcok-password'
        it('should handle account deletion with the api', async () => {
            mockApi.onDelete('/auth').reply(200, { message : 'MOCK-SERVER-MSG'})
            store.dispatch(deleteAccount({ password }))
            expect(await getAction(store, "DELETING_ACCOUNT")).toEqual({ type: 'DELETING_ACCOUNT' })
            expect(await getAction(store, "ACCOUNT_DELETED")).toEqual({ type: 'ACCOUNT_DELETED' })
            expect(await getAction(store, "LOGOUT")).toEqual({ type: 'LOGOUT' })
            expect(await getAction(store, "RESET_APP")).toEqual({ type: 'RESET_APP' })
        })
        it('should handle api errors', async () => {
            mockApi.onDelete('/auth').reply(400)
            store.dispatch(deleteAccount({ password }))
            expect(await getAction(store, "DELETING_ACCOUNT")).toEqual({ type: 'DELETING_ACCOUNT' })
            expect(await getAction(store, "ACCOUNT_DELETION_FAILED")).toEqual({ type: "ACCOUNT_DELETION_FAILED" })
        })
    })
})