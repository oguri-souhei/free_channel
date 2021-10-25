include RoomsHelper

foo = User.create!({
  name: 'foo',
  email: 'foo@bar.com',
  password: 'password',
  password_confirmation: 'password',
})

tom = User.create!({
  name: 'tom',
  email: 'tom@example.com',
  password: 'password',
  password_confirmation: 'password',
})

taro = User.create!({
  name: 'taro',
  email: 'taro@example.com',
  password: 'password',
  password_confirmation: 'password',
})

pien = User.create!({
  name: 'pien',
  email: 'pien@example.com',
  password: 'passsword',
  password_confirmation: 'passsword',
})

bar = User.create!({
  name: 'bar',
  email: 'bar@example.com',
  password: 'password',
  password_confirmation: 'password'
})

room1 = Room.create!({
  name: 'きのこかたけのこか',
  category: 'その他',
  user: foo
})

room2 = Room.create!({
  name: 'Example room',
  category: 'プログラミング',
  user: tom
})

room3 = Room.create!({
  name: 'コロナいつ終わるの？',
  category: 'その他',
  user: taro
})

Room.create!({
  name: 'ぴえんぴえんぴえんぴえんぴえん',
  category: 'その他',
  user: pien
})

100.times do |n|
  User.create!({
    name: Faker::FunnyName.name,
    email: "example-#{n}@example.com",
    password: 'password',
    password_confirmation: 'password'
  })
end

300.times do
  Room.create!({
    name: Faker::Mountain.name,
    category: CATEGORIES.sample,
    user: [foo, tom, taro, pien, bar].sample
  })
end

100.times do
  Comment.create!({
    sentence: Faker::Lorem.paragraph,
    user: [foo, tom, taro, pien, bar].sample,
    room: room1
  })
end

100.times do
  Comment.create!({
    sentence: Faker::Lorem.paragraph,
    user: [foo, tom, taro, pien, bar].sample,
    room: room2
  })
end
