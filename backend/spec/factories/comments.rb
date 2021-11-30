FactoryBot.define do
  factory :comment do
    sentence { 'This is test comment.' }
    opinion { 'opinion_1' }
    association :user
    association :room
  end

  factory :new_comment, class: 'Comment' do
    sentence { 'This is new comment.' }
    opinion { 'opinion_2' }
    association :user
    association :room
  end
end
