FactoryBot.define do
  factory :comment do
    sentence { 'This is test comment.' }
    association :user
    association :room
  end

  factory :new_comment, class: 'Comment' do
    sentence { 'This is new comment.' }
    association :user
    association :room
  end
end
