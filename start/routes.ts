import Route from '@ioc:Adonis/Core/Route'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// 유저관련 라우터
Route.group(() => {
  Route.post('/', async () => {
    'UsersController.create'
  })
  Route.get('/one', 'UsersController.getOne')
  Route.get('/list', 'UsersController.getList')
  Route.put('/up', 'UsersController.update')
  Route.get('/del', 'UsersController.delOne')
}).prefix('/users')

// 상품 관련 라우터
Route.group(() => {
  Route.post('/', async () => {
    'ProductsController.create'
  })
  Route.get('/one', 'ProductsController.getOne')
  Route.get('/list', 'ProductsController.getList')
  Route.get('/list/:sort', 'ProductsController.getListPrice')
  Route.put('/up', 'ProductsController.update')
  Route.get('/del', 'ProductsController.delOne')
}).prefix('/products')

// 장바구니 관련 라우터
Route.group(() => {
  Route.post('/', async () => {
    'CartsController.create'
  })
  Route.get('/one', 'CartsController.getOne')
  Route.get('/list', 'CartsController.getList')
  Route.get('/list/:id', 'CartsController.getListUser')
  Route.put('/up', 'CartsController.update')
  Route.get('/del', 'CartsController.delOne')
  Route.get('/test/:id/:num', 'CartsController.increaseCount')
  Route.get('/buy/test/:id', 'CartsController.buyCart')
}).prefix('/carts')

Route.any('*', ({ response }: HttpContextContract) => {
  response.status(404).json({ success: false })
})
