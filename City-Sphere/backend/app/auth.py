from flask import Blueprint, render_template, redirect, url_for, flash, request, current_app, session
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.urls import url_parse
from . import db, oauth, get_redirect_uri
from .models import User

auth = Blueprint('auth', __name__)

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    
    if request.method == 'POST':
        email = request.form.get('email')
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(email=email).first()
        if user:
            flash('Email already exists')
            return redirect(url_for('auth.signup'))
        
        user = User.query.filter_by(username=username).first()
        if user:
            flash('Username already exists')
            return redirect(url_for('auth.signup'))
        
        new_user = User(email=email, username=username)
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        return redirect(url_for('auth.login'))
    
    return render_template('auth/signup.html')

@auth.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        remember = True if request.form.get('remember') else False
        
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            flash('Please check your login details and try again.')
            return redirect(url_for('auth.login'))
        
        login_user(user, remember=remember)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('main.dashboard')
        return redirect(next_page)
    
    return render_template('auth/login.html')

@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))

# Google OAuth routes
@auth.route('/google-login')
def google_login():
    if not current_app.config['GOOGLE_CLIENT_ID']:
        flash('Google login is not configured.')
        return redirect(url_for('auth.login'))
    
    redirect_uri = get_redirect_uri('/google-callback')
    return oauth.google.authorize_redirect(redirect_uri)

@auth.route('/google-callback')
def google_callback():
    token = oauth.google.authorize_access_token()
    user_info = oauth.google.parse_id_token(token)
    
    user = User.get_or_create(
        email=user_info['email'],
        username=user_info['email'].split('@')[0],
        social_id=user_info['sub'],
        social_provider='google'
    )
    
    login_user(user)
    return redirect(url_for('main.dashboard'))

# Facebook OAuth routes
@auth.route('/facebook-login')
def facebook_login():
    if not current_app.config['FACEBOOK_CLIENT_ID']:
        flash('Facebook login is not configured.')
        return redirect(url_for('auth.login'))
    
    redirect_uri = get_redirect_uri('/facebook-callback')
    return oauth.facebook.authorize_redirect(redirect_uri)

@auth.route('/facebook-callback')
def facebook_callback():
    token = oauth.facebook.authorize_access_token()
    resp = oauth.facebook.get('me', params={'fields': 'id,email,name'})
    user_info = resp.json()
    
    # Facebook might not provide email directly
    email = user_info.get('email', f"{user_info['id']}@facebook.com")
    
    user = User.get_or_create(
        email=email,
        username=user_info['name'].replace(' ', '_').lower(),
        social_id=user_info['id'],
        social_provider='facebook'
    )
    
    login_user(user)
    return redirect(url_for('main.dashboard'))
