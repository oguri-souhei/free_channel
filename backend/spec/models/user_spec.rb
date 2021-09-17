require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { build(:user) }
  let(:tom) { create(:tom) }
  let(:comment) { create(:comment) }

  describe 'Association' do
    it { should have_many :rooms }
    it { should have_many :comments }
    it { should have_many :favorites }

    it 'has many favorite_comments' do
      favorites = create_list(:favorite, 3, user: tom)
      aggregate_failures do
        expect(tom.favorite_comments.length).to eq 3
        expect(tom.favorite_comments[0]).to eq favorites[0].comment
        expect(tom.favorite_comments[1]).to eq favorites[1].comment
        expect(tom.favorite_comments[2]).to eq favorites[2].comment
      end
    end
  end

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

    # アバター
    context 'avatar' do
      it 'is valid with allow formatted file' do
        user.avatar = File.open("#{Rails.root}/spec/files/test.jpg")
        user.valid?
        expect(user.errors[:avatar]).to be_blank
      end

      it 'is invalid with forbidden type file' do
        user.avatar = File.open("#{Rails.root}/spec/files/test.txt")
        user.valid?
        expect(user.errors[:avatar]).to include '"txt"ファイルのアップロードは許可されていません。アップロードできるファイルタイプ：jpg, jpeg, png'
      end
    end
  end

  describe 'Methods' do
    context '#update_without_password' do
      let(:user_params) { attributes_for(:user, password: '   ', password_confirmation: '     ') }
      let(:user_params_with_password) { attributes_for(:user) }

      context 'when success' do
        it 'returns true' do
          result = tom.update_without_password(user_params)
          expect(result).to be_truthy
        end

        it 'updates user without password' do
          tom.update_without_password(user_params)
          aggregate_failures do
            expect(tom.name).to eq user_params[:name]
            expect(tom.email).to eq user_params[:email]
            expect(user_params[:password]).to_not be_valid_password_of(tom)
          end
        end

        # パスワードありでも更新できる
        it 'updates user with password' do
          tom.update_without_password(user_params_with_password)
          aggregate_failures do
            expect(tom.name).to eq user_params_with_password[:name]
            expect(tom.email).to eq user_params_with_password[:email]
            expect(user_params_with_password[:password]).to be_valid_password_of(tom)
          end
        end
      end

      context 'when name is blank' do
        let(:wrong_params) { attributes_for(:user, name: '  ') }

        it 'returns false' do
          result = tom.update_without_password(wrong_params)
          expect(result).to be_falsey
        end

        it 'does not update user' do
          tom.update_without_password(wrong_params)
          tom.reload
          expect(tom.name).to_not eq wrong_params[:name]
        end
      end

      context 'when name is too long' do
        let(:wrong_params) { attributes_for(:user, name: 'a' * 51) }

        it 'returns false' do
          result = tom.update_without_password(wrong_params)
          expect(result).to be_falsey
        end

        it 'does not update user' do
          tom.update_without_password(wrong_params)
          tom.reload
          expect(tom.name).to_not eq wrong_params[:name]
        end
      end

      context 'when email is blank' do
        let(:wrong_params) { attributes_for(:user, email: '    ') }

        it 'returns false' do
          result = tom.update_without_password(wrong_params)
          expect(result).to be_falsey
        end

        it 'does not update user' do
          tom.update_without_password(wrong_params)
          tom.reload
          expect(tom.email).to_not eq wrong_params[:email]
        end
      end

      context 'when email is too long' do
        let(:wrong_params) { attributes_for(:user, name: 'a' * 240 + '@example.com') }

        it 'returns false' do
          result = tom.update_without_password(wrong_params)
          expect(result).to be_falsey
        end

        it 'does not update user' do
          tom.update_without_password(wrong_params)
          tom.reload
          expect(tom.email).to_not eq wrong_params[:email]
        end
      end

      context 'when email is invalid' do
        let(:wrong_params) { attributes_for(:user, email: 'foo@bar,com') }

        it 'returns false' do
          result = tom.update_without_password(wrong_params)
          expect(result).to be_falsey
        end

        it 'does not update user' do
          tom.update_without_password(wrong_params)
          tom.reload
          expect(tom.email).to_not eq wrong_params[:email]
        end
      end

      context 'when password is too short' do
        let(:wrong_params) { attributes_for(:user, password: 'aaa') }

        it 'returns false' do
          result = tom.update_without_password(wrong_params)
          expect(result).to be_falsey
        end

        it 'does not update user' do
          tom.update_without_password(wrong_params)
          tom.reload
          expect(wrong_params[:password]).to_not be_valid_password_of(tom)
        end
      end

      context 'when password_confirmation is wrong' do
        let(:wrong_params) { attributes_for(:user, password: 'password', password_confirmation: 'foobar') }

        it 'returns false' do
          result = tom.update_without_password(wrong_params)
          expect(result).to be_falsey
        end

        it 'does not update user' do
          tom.update_without_password(wrong_params)
          tom.reload
          expect(wrong_params[:password]).to_not be_valid_password_of(tom)
        end
      end
    end

    context '#favorite' do
      it 'creates a new record' do
        expect {
          tom.favorite(comment)
        }.to change(Favorite, :count).by(1)
      end
    end

    context '#unfavorite' do
      # 指定したコメントのいいねが削除されているか？
      it 'unfavorite the comment' do
        tom.favorite(comment)
        aggregate_failures do
          expect(tom.favorited?(comment)).to be_truthy
          tom.unfavorite(comment)
          expect(tom.favorited?(comment)).to be_falsey
        end
      end

      it 'destroy a favorite record' do
        tom.favorite(comment)
        expect {
          tom.unfavorite(comment)
        }.to change(Favorite, :count).by(-1)
      end
    end

    context '#favorited?' do
      it 'returns true when the comment is favorited' do
        tom.favorite(comment)
        expect(tom.favorited?(comment)).to be_truthy
      end

      it 'returns false when the comment is not favorited' do
        expect(tom.favorited?(comment)).to be_falsey
      end
    end
  end
end
