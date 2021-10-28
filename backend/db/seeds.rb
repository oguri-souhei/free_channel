include RoomsHelper

# アバターの画像ファイル一覧
avatars = [
  'files/animal_hoshibana_mogura.png',
  'files/animal_mouse_baby_science.png',
  'files/animal_science_nude_mouse.png',
  'files/animal_tenrec.png',
  'files/character_food_katsuobushi.png',
  'files/food_ebi_fry_set.png',
  'files/food_kakuni_manju.png',
  'files/hamster_sleeping_golden.png',
  'files/onepiece01_luffy.png',
  'files/onepiece04_usopp_sogeking.png',
  'files/onepiece16_moria.png',
  'files/opera_singer_man.png',
]

souhei = User.create!({
  name: 'そうへい',
  email: 'foo@bar.com',
  password: 'password',
  password_confirmation: 'password',
  avatar: File.open('files/profile.jpg')
})

first_room = Room.create!({
  name: 'アプリちゃんと動いてる？',
  category: 'プログラミング',
  user: souhei
})

30.times do |n|
  Room.create!({
    name: "颯平の部屋#{n}",
    category: CATEGORIES.sample,
    user: souhei
  })
end

tatsuki = User.create!({
  name: 'たつき',
  email: 'tatsuki@example.com',
  password: 'password',
  password_confirmation: 'password',
  avatar: File.open('files/dog.jpg')
})

30.times do |n|
  Room.create!({
    name: "たつきの部屋#{n}",
    category: CATEGORIES.sample,
    user: tatsuki
  })
end

shuya = User.create!({
  name: 'しゅーや',
  email: 'shuya@example.com',
  password: 'password',
  password_confirmation: 'password',
  avatar: File.open('files/cat.jpg')
})

30.times do |n|
  Room.create!({
    name: "しゅうやの部屋#{n}",
    category: CATEGORIES.sample,
    user: shuya
  })
end

300.times do |n|
  user = User.create!({
    name: Gimei.hiragana,
    email: Faker::Internet.email,
    password: 'password',
    password_confirmation: 'password',
    avatar: File.open(avatars.sample)
  })

  Room.create!({
    name: user.name + 'の部屋',
    category: 'その他',
    user: user
  })
end

users = User.all

100.times do
  Room.create!({
    name: "#{Faker::Game.title}やった？",
    category: 'ゲーム',
    user: users.sample
  })
end

100.times do
  Room.create!({
    name: "#{Faker::Movie.title}見た？",
    category: '映画',
    user: users.sample
  })
end

20.times do
  Comment.create!({
    sentence: Faker::Lorem.paragraph,
    user: users.sample,
    room: Room.second
  })
end

20.times do
  Comment.create!({
    sentence: Faker::Lorem.paragraph,
    user: users.sample,
    room: Room.third
  })
end