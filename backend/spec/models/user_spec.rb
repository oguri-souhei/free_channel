require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { build(:user) }

  describe 'Validation' do
    # 名前
    context 'name' do
      it { should validate_presence_of(:name).with_message('を入力してください') }
      it { should validate_length_of(:name).is_at_most(50).with_message('は50文字以内で入力してください') }
    end

    # メールアドレス
    context 'email' do
      it { should validate_presence_of(:email).with_message('を入力してください') }
      it { should validate_length_of(:email).is_at_most(250).with_message('は250文字以内で入力してください') }

      it 'must be unique' do
        user.save
        other_user = build(:user, email: user.email)
        other_user.valid?
        expect(other_user.errors[:email]).to include 'は既に使用されています'
      end

      it 'must be unique case insensitive' do
        user.save
        other_user = build(:user, email: user.email.upcase)
        other_user.valid?
        expect(other_user.errors[:email]).to include 'は既に使用されています'
      end

      it 'is valid with correct format address' do
        valid_addresses = %w[user@example.com USER@foo.COM A_US-ER@foo.bar.org first.last@foo.jp alice+bob@baz.cn]
        valid_addresses.each do |valid_address|
          user.email = valid_address
          expect(user).to be_valid
        end
      end

      it 'is invalid with wrong format address' do
        invalid_addresses = %w[user@example,com user_at_foo.org user.name@example. foo@bar_baz.com foo@bar+baz.com]
        invalid_addresses.each do |invalid_address|
          user.email = invalid_address
          user.valid?
          expect(user.errors[:email]).to include 'は正しい形式で設定してください'
        end
      end
    end

    # パスワード
    context 'password' do
      it { should validate_presence_of(:password).allow_nil.with_message('を入力してください') }
      it { should validate_length_of(:password).is_at_least(6).with_message('は6文字以上で入力してください') }
      it { should validate_confirmation_of(:password).with_message('とパスワードの入力が一致しません') }
    end

    # パスワード（確認用）
    context 'password_confirmation' do
      it { should validate_presence_of(:password_confirmation).allow_nil.with_message('を入力してください') }
    end
  end
end
