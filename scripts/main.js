
$(function(){
	//смена иконки при наведении
	$('header>i').bind('mouseover',function(e){
		let oldIcon=$(e.target).attr('class');
		let newicon=$(e.target).data('iconactive');
		$(e.target).removeAttr('class').attr('class',newicon);
		$('header>i').bind('mouseout',function(e){
			$(e.target).removeAttr('class').attr('class',oldIcon);
		});
	});
	//показать форму добавления заметки
	$('header>#newNote').bind('click',function(){
		if ($('.form#note').is(':visible')) {
			return false;
		} else {
			refreshFolderSelect();
			$('.form:visible').slideUp(200);
			$('.form#note').slideDown(200).find('input').focus();
		}
		
	})
	//показать форму добавления папки
	$('header>#newFolder').bind('click',function(){
		if ( $('.form#folder').is(':visible') ) {
			return false;
		} else {
			refreshFolderSelect();
			$('.form:visible').slideUp(200);
			$('.form#folder').slideDown(200).find('input').focus();
		}
		
		
	})
	//вызываем модальное окно и спрашиваем
	$('header>#removeNote').bind('click',function(){
		let removeNote=$('#list span.active')[0];
		console.log('rem note=',removeNote)
		if (removeNote!=undefined) {
			$('#modal').modal('setting', 'transition', 'horizontal flip').modal('show');
		}
	})
	//кнопка подтверждения формы новой заявки
	$('form#noteInputs button.true').bind('click',function(){
		let form=$(this).parent().parent();
		let wrap=form.parent();
		let nameNote=form.find('input').val();
		let textNote=form.find('textarea').val();
		let folder=$('#noteChangeFolder div.text').text();
		if (nameNote!=='' && textNote!=='') {
			console.log('folder=',folder,$('span.folder>name:contains("'+folder+'")').parent())
			let newNote="<span onclick='showNote($(this))' data-text='"+textNote+"' title='"+textNote+"'><i class='sticky outline note icon'></i>"+nameNote+"</span>";
			//добавляем в папку
			if (folder!='') {
				console.log('указана папка с именем ',folder)
				$('span.folder>name:contains("'+folder+'")').parent().find('div.notes').append(newNote);
			} else {
				$('#list').append(newNote);
			}
			$('div.form:visible').slideUp(200).find('input,textarea').val('');
			$('div.text').addClass('default').html('Выберите папку');
		} else {
			wrap.find('.message').slideDown(100);
			setTimeout(function(){
				wrap.find('.message').slideUp(100);
			},2000);
		}
		return false;
	})
	//кнопка отмены формы заявки
	$('form#noteInputs button.false').bind('click',function(){
		console.log($(this).parent().parent().parent())
		$(this).parent().parent().parent().slideUp(200).find('message').hide();
		return false;
	})

	$('form#folderInputs button.true').bind('click',function(){
		let form=$(this).parent().parent();
		let wrap=form.parent();
		let nameFolder=form.find('input').val();
		if (nameFolder!=='') {
			let newFolder="<span class='folder' data-state='invisible'><i class='folder icon'></i><name>"+nameFolder+"</name><div class='notes'></div></span>";//Добавить код папки
			$('#list').append(newFolder);
			$('div.form:visible').slideUp(200).find('input,textarea').val('');
			$('#list>span').popup();
			rebindOpenFolder();
		} else {
			wrap.find('.message').slideDown(100);
			setTimeout(function(){
				wrap.find('.message').slideUp(100);
			},2000);
		}
		return false;
	})
	$('form#folderInputs button.false').bind('click',function(){
		$(this).parent().parent().parent().slideUp(200).find('message').hide();
		return false;
	})

	


});
$('header>i').popup();
function showNote(note) {
	if (note.hasClass('folder')!=true) {
		$('#list').find('span.active').removeAttr('class');
		note.attr('class','active');
		$('#output').text(note.data('text')).slideDown(100);
	}
	
}
$('div.folders').dropdown();
// получаем список папок и добавляем в select
function refreshFolderSelect() {
	var folders=[];
	for(var i=0;i<$('#list>span.folder').length;i++) {
		let folder=$('#list').find('span.folder').get(i);
		folders.push($(folder).find('name').text());
	}
	//добавляем в селект
	$('div.menu').html('');
	for(let i=0;i<folders.length;i++) {
		console.log('i=',i)
		let folderName=folders[i];
		$('div.menu').append('<div class="item" data-value="'+folderName+'"><i class="folder icon"></i>'+folderName+'</div>');
	}
};

function rebindOpenFolder() {
	$('span.folder').bind('click',function(e){
		console.log(e,e.currentTarget);
		if (e.currentTarget.tagName=='SPAN' && e.currentTarget.className=='folder') {
			console.log('yeah')
		} else {
			console.log('no(')
		}
		if (e.target.tagName=='span' && e.target.className=='active') {
			return false;
		} else if ( (e.currentTarget.tagName=='SPAN' && e.currentTarget.className=='folder') && e.target!=$('span.active')[0]) {
			let state=$(this).attr('data-state');
			if (state!=='visible') {
				$('span.folder').unbind('click');
				// показываем
				$(this).attr('data-state','visible').find('i.folder').removeAttr('class').attr('class','folder open icon');
				$(this).find('div.notes').slideDown(50);
				rebindOpenFolder();
			} else {
				//скрываем
				$(this).attr('data-state','invisible').find('i.folder').removeAttr('class').attr('class','folder icon');
				$(this).find('div.notes').slideUp(50);
				$(this).find('span.active').removeClass('active');
				$('span.folder').unbind('click');
				rebindOpenFolder();
			}
		}
	})
};
function applyRemoveNote() {
	$('#list span.active').eq(0).animateCss('bounceOutLeft');
	setTimeout(function(){
		$('#list span.active').eq(0).remove();
	},500)
};
rebindOpenFolder();
$('.dropdown').dropdown();

// AnimateCSS
$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = (function(el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };

      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));

    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);

      if (typeof callback === 'function') callback();
    });

    return this;
  },
});