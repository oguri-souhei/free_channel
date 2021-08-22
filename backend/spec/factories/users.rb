FactoryBot.define do
  factory :user do
    sequence(:name) { |n| "Test User#{n}" }
    sequence(:email) { |n| "test-user-#{n}@example.com" }
    password { 'password' }
    password_confirmation { 'password' }
  end

  factory :tom, class: 'User' do
    name { 'Tom' }
    email { 'tom@example.com' }
    password { 'tom-password' }
    password_confirmation { 'tom-password' }
  end

  factory :invalid_user, class: 'User' do
    name { '  ' }
    email { '  ' }
    password { '  ' }
    password_confirmation { '  ' }
  end
end
