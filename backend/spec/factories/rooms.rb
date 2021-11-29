FactoryBot.define do
  factory :room do
    theme { 'Test room' }
    description { 'これは部屋の説明です。' }
    category { 'プログラミング' }
    association :user
  end

  factory :new_room, class: 'Room' do
    theme { 'New room' }
    description { '新しい部屋の説明です。' }
    category { 'スポーツ' }
    association :user
  end
end
