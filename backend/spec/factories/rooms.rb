FactoryBot.define do
  factory :room do
    name { 'Test room' }
    category { 'プログラミング' }
    association :user
  end

  factory :new_room, class: 'Room' do
    name { 'New room' }
    category { 'スポーツ' }
    association :user
  end
end
